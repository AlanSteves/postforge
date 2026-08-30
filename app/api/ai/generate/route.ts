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

    // Google Gemini API Generation Engine
    let aiContent = "";
    let isDegraded = false;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey && !geminiKey.includes("your-gemini-api-key-here") && !geminiKey.includes("your_gemini_api_key_here")) {
      const systemPrompt = `You are an expert LinkedIn ghostwriter. Write a viral, high-converting LinkedIn post based strictly on the user's prompt. 
Tone: ${tone}
Audience: ${audience}
Length: ${length}
Content Type: ${contentType}
Language: ${language}

RULES:
1. Provide ONLY the final LinkedIn post copy.
2. DO NOT include any conversational preamble or meta headings (e.g. do NOT write "Here is your post:").
3. Include 3-5 relevant hashtags at the bottom.`;

      const geminiModels = [
        "gemini-3.1-flash-lite-preview",
        "gemini-3-flash-preview",
        "gemini-flash-latest",
      ];

      for (const model of geminiModels) {
        if (aiContent) break;
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey.trim()}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: systemPrompt }],
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
          if (geminiRes.ok && geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiContent = geminiData.candidates[0].content.parts[0].text.trim();
            break;
          } else {
            console.error(`Gemini model ${model} response:`, geminiRes.status, geminiData.error?.message || geminiData);
          }
        } catch (geminiErr) {
          console.error(`Gemini model ${model} exception:`, geminiErr);
        }
      }
    }

    // Dynamic prompt-aware local fallback if API key is unconfigured or unreachable
    if (!aiContent) {
      aiContent = generateRichLinkedInPost(prompt, tone, audience);
      isDegraded = true;
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
            imageUrl: imagePreview || preferences?.imageUrl || null,
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
      degraded: isDegraded,
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
  const words = content.replace(/[^\w\s]/gi, "").split(/\s+/).filter((w) => w.length > 4);
  const tag1 = words[0] ? `#${words[0].toLowerCase()}` : "#leadership";
  const tag2 = words[1] ? `#${words[1].toLowerCase()}` : "#growth";
  const fallbackTag = `#${fallbackTopic.toLowerCase().replace(/[^\w]/g, "")}`;
  return Array.from(new Set([tag1, tag2, fallbackTag, "#business", "#innovation"]));
}
