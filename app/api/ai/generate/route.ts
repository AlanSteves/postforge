import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  conversationId: z.string().optional(),
  imagePreview: z.string().nullable().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = generateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid prompt payload" },
        { status: 400 }
      );
    }

    const { prompt, imagePreview } = validation.data;
    let conversationId = validation.data.conversationId;

    const user = await getCurrentUser().catch(() => null);

    let tone = "Bold";
    let audience = "Founders";
    let length = "Medium";
    let contentType = "Thought Leadership";
    let language = "English";
    let preferences = null;

    if (user) {
      try {
        preferences = await prisma.preference.findUnique({
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
        console.error("Failed to load user preferences:", err);
      }
    }

    let aiContent = "";
    let aiGenerationFailed = false;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && !apiKey.includes("your-gemini-api-key-here")) {
      try {
        const systemInstruction = `You are an expert LinkedIn ghostwriter. Write a viral, high-converting LinkedIn post based strictly on the user's prompt.
Tone: ${tone}
Audience: ${audience}
Length: ${length}
Content Type: ${contentType}
Language: ${language}

RULES:
1. Provide ONLY the final LinkedIn post copy.
2. NO introductory or meta conversational headers.
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
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
              },
            }),
          }
        );

        const geminiData = await geminiRes.json();

        const candidateText =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiRes.ok && candidateText) {
          aiContent = candidateText.trim();
        } else {
          aiGenerationFailed = true;
          console.error(
            "Gemini API returned error:",
            geminiRes.status,
            geminiData?.error?.message || geminiData
          );
        }
      } catch (err) {
        aiGenerationFailed = true;
        console.error("Gemini API network exception:", err);
      }
    } else {
      aiGenerationFailed = true;
    }

    // Fallback generation engine — only used if Gemini call failed or key is missing.
    // aiGenerationFailed is surfaced in the response so the client can flag degraded output.
    if (!aiContent) {
      aiContent = generateRichLinkedInPost(prompt, tone, audience);
    }

    let userMessageObj = {
      id: `msg-user-${Date.now()}`,
      content: prompt,
      role: "USER",
      createdAt: new Date().toISOString(),
    };

    let assistantMessageObj = {
      id: `msg-ai-${Date.now()}`,
      content: aiContent,
      role: "ASSISTANT",
      createdAt: new Date().toISOString(),
    };

    let postObj = {
      id: `post-${Date.now()}`,
      content: aiContent,
      hashtags: extractHashtags(aiContent, audience),
      status: "DRAFT",
      imageUrl: imagePreview || null,
      createdAt: new Date().toISOString(),
    };

    if (user) {
      try {
        if (!conversationId) {
          const newConv = await prisma.conversation.create({
            data: {
              userId: user.id,
              title: prompt.slice(0, 35) || "New Conversation",
            },
          });
          conversationId = newConv.id;
        }

        const savedUserMsg = await prisma.message.create({
          data: {
            conversationId,
            role: "USER",
            content: prompt,
            imagePreview: imagePreview || null,
          },
        });

        const savedAssistantMsg = await prisma.message.create({
          data: {
            conversationId,
            role: "ASSISTANT",
            content: aiContent,
          },
        });

        const savedPost = await prisma.post.create({
          data: {
            userId: user.id,
            conversationId,
            content: aiContent,
            hashtags: extractHashtags(aiContent, audience),
            imageUrl: imagePreview || null,
            status: "DRAFT",
          },
        });

        userMessageObj = savedUserMsg as any;
        assistantMessageObj = savedAssistantMsg as any;
        postObj = savedPost as any;
      } catch (dbErr) {
        console.error("DB persistence error during generation:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      degraded: aiGenerationFailed,
      data: {
        conversationId: conversationId || `conv-${Date.now()}`,
        userMessage: userMessageObj,
        assistantMessage: assistantMessageObj,
        post: postObj,
      },
    });
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate post" },
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
  const words = content.replace(/[^\w\s]/gi, "").split(/\s+/).filter(w => w.length > 4);
  const tag1 = words[0] ? `#${words[0].toLowerCase()}` : "#leadership";
  const tag2 = words[1] ? `#${words[1].toLowerCase()}` : "#growth";
  const fallbackTag = `#${fallbackTopic.toLowerCase().replace(/[^\w]/g, "")}`;
  return Array.from(new Set([tag1, tag2, fallbackTag, "#business", "#innovation"]));
}