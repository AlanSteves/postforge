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

    // Call OpenAI Chat Completion API
    let aiContent = "";
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && !apiKey.includes("your-openai-api-key-here")) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.trim()}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert LinkedIn ghostwriter. Write a viral, high-converting LinkedIn post based strictly on the user's prompt. 
Tone: ${tone}
Audience: ${audience}
Length: ${length}
Content Type: ${contentType}
Language: ${language}

RULES:
1. Provide ONLY the final LinkedIn post copy.
2. NO introductory or meta conversational headers (do NOT say "Here is your post" or "AI RESPONSE:").
3. Include 3-5 relevant hashtags at the bottom.`,
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        const openAiData = await openAiRes.json();

        if (openAiRes.ok && openAiData.choices?.[0]?.message?.content) {
          aiContent = openAiData.choices[0].message.content.trim();
        } else {
          console.error("OpenAI API returned error status:", openAiRes.status, openAiData);
        }
      } catch (err) {
        console.error("OpenAI API network exception:", err);
      }
    }

    // Dynamic prompt-aware generation fallback
    if (!aiContent) {
      aiContent = generateDynamicLinkedInPost(prompt, tone, audience);
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

function generateDynamicLinkedInPost(prompt: string, tone: string, audience: string): string {
  const cleanPrompt = prompt.trim();
  const topicTitle = cleanPrompt.length > 50 ? cleanPrompt.slice(0, 47) + "..." : cleanPrompt;

  const hook = tone.toLowerCase().includes("bold")
    ? `Most ${audience.toLowerCase()} get this completely wrong when thinking about: "${topicTitle}"`
    : `A key breakdown for ${audience.toLowerCase()} on: "${topicTitle}"`;

  const body = `Here is what experience has taught me:\n\n1. "${cleanPrompt}" requires clear focus and execution.\n2. Small daily improvements compound faster than sporadic efforts.\n3. The secret is consistency, not complexity.`;

  const cta = `What is your take on this? Drop your thoughts below! 👇`;
  const hashtags = extractHashtags(cleanPrompt, audience).join(" ");

  return `${hook}\n\n${body}\n\n${cta}\n\n${hashtags}`;
}

function extractHashtags(content: string, fallbackTopic: string): string[] {
  const regex = /#[\w]+/g;
  const matches = content.match(regex);
  if (matches && matches.length > 0) {
    return Array.from(new Set(matches));
  }
  const cleanWord = fallbackTopic.toLowerCase().replace(/[^\w]/g, "");
  return [`#${cleanWord || "leadership"}`, "#business", "#strategy", "#growth"];
}
