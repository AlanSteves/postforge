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

    if (user) {
      try {
        const preferences = await prisma.preference.findUnique({
          where: { userId: user.id },
        });
        if (preferences) {
          tone = preferences.tone || tone;
          audience = preferences.audience || audience;
        }
      } catch (err) {
        console.error("Failed to load user preferences:", err);
      }
    }

    let aiContent = "";
    let aiGenerationFailed = false;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && !apiKey.includes("your-gemini-api-key-here") && !apiKey.includes("your_gemini_api_key_here")) {
      try {
        const systemInstruction = `You are a helpful writing assistant having a conversation about LinkedIn content ideas. Respond naturally and conversationally to the user's request. Do not format this as a finished LinkedIn post — no hashtags, no post structure. Just discuss/draft the idea as you would in a chat.`;

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
        const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiRes.ok && candidateText) {
          aiContent = candidateText.trim();
        } else {
          aiGenerationFailed = true;
          console.error(
            "Gemini API returned error in chat generation:",
            geminiRes.status,
            geminiData?.error?.message || geminiData
          );
        }
      } catch (err) {
        aiGenerationFailed = true;
        console.error("Gemini API network exception in chat generation:", err);
      }
    } else {
      aiGenerationFailed = true;
    }

    // Natural conversational fallback if API is unavailable
    if (!aiContent) {
      aiContent = generateConversationalResponse(prompt, tone, audience);
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

        userMessageObj = savedUserMsg as any;
        assistantMessageObj = savedAssistantMsg as any;
      } catch (dbErr) {
        console.error("DB persistence error during chat generation:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      degraded: aiGenerationFailed,
      data: {
        conversationId: conversationId || `conv-${Date.now()}`,
        userMessage: userMessageObj,
        assistantMessage: assistantMessageObj,
      },
    });
  } catch (error) {
    console.error("AI Chat Generation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate chat reply" },
      { status: 500 }
    );
  }
}

function generateConversationalResponse(prompt: string, tone: string, audience: string): string {
  const cleanPrompt = prompt.trim();
  return `That's a fantastic concept for ${audience.toLowerCase()}! Here's how I think we can approach "${cleanPrompt}":\n\nWe should open by challenging a common misconception, followed by 3 core execution principles, and close with an engaging question for your audience.\n\nDouble-click this message whenever you're ready, and I will format it into a complete, publish-ready LinkedIn post for you!`;
}