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

    // Generate Content via OpenAI API (if OPENAI_API_KEY set) or natural generator fallback
    let aiContent = "";
    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && !apiKey.includes("your-openai-api-key-here")) {
      try {
        const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are an expert LinkedIn ghostwriter. Write a high-converting LinkedIn post based on the prompt. Tone: ${tone}, Target Audience: ${audience}, Post Length: ${length}, Content Type: ${contentType}, Language: ${language}.
RULES:
1. Provide ONLY the final, natural LinkedIn post copy.
2. DO NOT include any headings like "AI RESPONSE:", "GENERATED POST:", "LINKEDIN POST:", or conversational preamble.
3. Include relevant hashtags at the bottom.`,
              },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
          }),
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          aiContent = openAiData.choices?.[0]?.message?.content?.trim() || "";
        }
      } catch (err) {
        console.error("OpenAI API call error, falling back:", err);
      }
    }

    if (!aiContent) {
      aiContent = generateNaturalLinkedInPost(prompt, tone, audience, length);
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

    // If user is authenticated & database is connected, persist records
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
        console.error("DB persistence error during generation, returning generated content:", dbErr);
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

function generateNaturalLinkedInPost(prompt: string, tone: string, audience: string, length: string): string {
  const tonePrefix = tone.toLowerCase().includes("bold")
    ? "The biggest lie in small business? \"Build it and they will come.\""
    : "Here is what nobody tells you about starting out:";
  
  const hook = `I spent months refining an idea without talking to users. Zero marketing. Zero feedback loop.\n\nWhen we launched? Absolute silence. 🦗`;
  const lessons = `Here are 3 harsh realities every ${audience.toLowerCase()} needs to internalize:\n\n1. Distribution is just as crucial as product development.\n2. Building in public creates your customer base before launch.\n3. Perfection is the enemy of momentum.\n\n${prompt}`;
  const callToAction = `Don't wait for perfect. Ship early, gather feedback, and iterate.\n\nWhat’s the single biggest lesson you learned the hard way? Let's discuss in the comments below! 👇`;
  const tags = `#${audience.toLowerCase().replace(/\s+/g, "")} #startup #buildinginpublic #ai #innovation`;

  return `${tonePrefix}\n\n${hook}\n\n${lessons}\n\n${callToAction}\n\n${tags}`;
}

function extractHashtags(content: string, fallbackTopic: string): string[] {
  const regex = /#[\w]+/g;
  const matches = content.match(regex);
  if (matches && matches.length > 0) {
    return Array.from(new Set(matches));
  }
  return [`#${fallbackTopic.toLowerCase().replace(/\s+/g, "")}`, "#ai", "#innovation", "#growth"];
}
