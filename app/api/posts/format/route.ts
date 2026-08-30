import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const formatSchema = z.object({
  messageId: z.string().optional(),
  content: z.string().optional(),
  conversationId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = formatSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid formatting payload" },
        { status: 400 }
      );
    }

    const { messageId, content: rawContent, conversationId: payloadConvId } = validation.data;
    const user = await getCurrentUser().catch(() => null);

    let contentToFormat = rawContent || "";
    let conversationId = payloadConvId || null;
    let imagePreview: string | null = null;

    let tone = "Bold";
    let audience = "Founders";
    let length = "Medium";
    let contentType = "Thought Leadership";
    let language = "English";

    // 1. Verify user authentication & message ownership
    if (user && messageId) {
      const dbMessage = await prisma.message.findUnique({
        where: { id: messageId },
        include: { conversation: true },
      });

      if (!dbMessage) {
        return NextResponse.json(
          { success: false, message: "Message not found" },
          { status: 404 }
        );
      }

      if (dbMessage.conversation.userId !== user.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized access to this message" },
          { status: 403 }
        );
      }

      contentToFormat = dbMessage.content;
      conversationId = dbMessage.conversationId;
      imagePreview = dbMessage.imagePreview || null;
    }

    if (!contentToFormat.trim()) {
      return NextResponse.json(
        { success: false, message: "No content provided to format" },
        { status: 400 }
      );
    }

    // Load user preferences
    if (user) {
      try {
        const preferences = await prisma.preference.findUnique({
          where: { userId: user.id },
        });
        if (preferences) {
          tone = preferences.tone || tone;
          audience = preferences.audience || audience;
          length = preferences.length || length;
          contentType = preferences.contentType || contentType;
          language = preferences.language || language;
        }
      } catch (err) {
        console.error("Failed to load user preferences in format route:", err);
      }
    }

    // 2. Format with Gemini API
    let formattedContent = "";
    let aiGenerationFailed = false;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && !apiKey.includes("your-gemini-api-key-here") && !apiKey.includes("your_gemini_api_key_here")) {
      try {
        const systemInstruction = `You are an expert LinkedIn ghostwriter. Write a viral, high-converting LinkedIn post based strictly on the provided content. 
Tone: ${tone}
Audience: ${audience}
Length: ${length}
Content Type: ${contentType}
Language: ${language}

RULES:
1. Provide ONLY the final LinkedIn post copy.
2. NO introductory or meta conversational headers (do NOT say "Here is your post:").
3. Include 3-5 relevant hashtags at the bottom.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: systemInstruction }],
              },
              contents: [
                {
                  role: "user",
                  parts: [{ text: contentToFormat }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
              },
            }),
          }
        );

        const geminiData = await geminiRes.json();
        const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiRes.ok && candidateText) {
          formattedContent = candidateText.trim();
        } else {
          aiGenerationFailed = true;
          console.error(
            "Gemini API returned error in format route:",
            geminiRes.status,
            geminiData?.error?.message || geminiData
          );
        }
      } catch (err) {
        aiGenerationFailed = true;
        console.error("Gemini API network exception in format route:", err);
      }
    } else {
      aiGenerationFailed = true;
    }

    // Fallback formatting engine if Gemini call fails or key unconfigured
    if (!formattedContent) {
      formattedContent = generateRichLinkedInPost(contentToFormat, tone, audience);
    }

    const hashtags = extractHashtags(formattedContent, audience);

    let postObj = {
      id: `post-${Date.now()}`,
      content: formattedContent,
      hashtags,
      status: "DRAFT",
      imageUrl: imagePreview || null,
      createdAt: new Date().toISOString(),
    };

    // 3. Persist Post record to database if user is logged in
    if (user) {
      try {
        const savedPost = await prisma.post.create({
          data: {
            userId: user.id,
            conversationId: conversationId || null,
            content: formattedContent,
            hashtags,
            imageUrl: imagePreview || null,
            status: "DRAFT",
          },
        });
        postObj = savedPost as any;
      } catch (dbErr) {
        console.error("DB post persistence error in format route:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      degraded: aiGenerationFailed,
      data: {
        post: postObj,
      },
    });
  } catch (error) {
    console.error("Post formatting error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to format post" },
      { status: 500 }
    );
  }
}

function generateRichLinkedInPost(prompt: string, tone: string, audience: string): string {
  const cleanPrompt = prompt.trim();
  const hash = cleanPrompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const patternIndex = hash % 3;

  const topicKeywords = cleanPrompt
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .slice(0, 4)
    .join(" ");

  if (patternIndex === 0) {
    return `Stop scrolling if you care about: ${cleanPrompt}\n\nHere is what separates top-performing ${audience.toLowerCase()} from the rest:\n\n📌 1. Actionable Strategy: Focus heavily on ${topicKeywords || "execution"}.\n📌 2. Systemize Early: Don't rely on memory; build reusable workflows.\n📌 3. Audience Value: Solve real problems instead of posting fluff.\n\nKey Takeaway: ${cleanPrompt} is all about consistency and leverage.\n\nHow are you tackling this in your workflow? Share your thoughts below! 👇\n\n${extractHashtags(cleanPrompt, audience).join(" ")}`;
  } else if (patternIndex === 1) {
    return `Unpopular opinion regarding ${cleanPrompt}:\n\nMost people try to overcomplicate this. They spend weeks planning and zero time shipping.\n\nHere is a 3-step framework to master it:\n\nStep 1: Simplify your initial approach to ${topicKeywords || "the core goal"}.\nStep 2: Gather real feedback from your ${audience.toLowerCase()} network.\nStep 3: Double down on what moves the needle.\n\nWhat’s your biggest takeaway here? Let's discuss in the comments! 💬\n\n${extractHashtags(cleanPrompt, audience).join(" ")}`;
  } else {
    return `I used to struggle with "${cleanPrompt}" until I learned this fundamental shift.\n\nIf you want to excel as a ${audience.toLowerCase()}, keep these 3 principles top of mind:\n\n💡 Principle 1: Clarity beats complexity every single time.\n💡 Principle 2: Feedback loops are your strongest growth driver.\n💡 Principle 3: Execution on ${topicKeywords || "your goal"} is what yields real impact.\n\nWhich of these 3 principles resonates most with you? 👇\n\n${extractHashtags(cleanPrompt, audience).join(" ")}`;
  }
}

function extractHashtags(content: string, fallbackTopic: string): string[] {
  const regex = /#[\w]+/g;
  const matches = content.match(regex);
  if (matches && matches.length > 0) {
    return Array.from(new Set(matches));
  }
  const words = content.replace(/[^\w\s]/gi, "").split(/\s+/).filter((w) => w.length > 4);
  const tag1 = words[0] ? `#${words[0].toLowerCase()}` : "#leadership";
  const tag2 = words[1] ? `#${words[1].toLowerCase()}` : "#growth";
  const fallbackTag = `#${fallbackTopic.toLowerCase().replace(/[^\w]/g, "")}`;
  return Array.from(new Set([tag1, tag2, fallbackTag, "#business", "#innovation"]));
}
