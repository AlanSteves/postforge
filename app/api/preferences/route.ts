import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const updatePreferencesSchema = z.object({
  tone: z.string().optional(),
  audience: z.string().optional(),
  length: z.string().optional(),
  contentType: z.string().optional(),
  language: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let preferences = await prisma.preference.findUnique({
      where: { userId: user.id },
    });

    if (!preferences) {
      preferences = await prisma.preference.create({
        data: {
          userId: user.id,
          tone: "Bold",
          audience: "Founders",
          length: "Medium",
          contentType: "Thought Leadership",
          language: "English",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        tone: preferences.tone,
        audience: preferences.audience,
        length: preferences.length,
        contentType: preferences.contentType,
        language: preferences.language,
        imageUrl: preferences.imageUrl,
      },
    });
  } catch (error) {
    console.error("GET preferences error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = updatePreferencesSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid preferences payload" },
        { status: 400 }
      );
    }

    const updated = await prisma.preference.upsert({
      where: { userId: user.id },
      update: validation.data,
      create: {
        userId: user.id,
        tone: validation.data.tone || "Bold",
        audience: validation.data.audience || "Founders",
        length: validation.data.length || "Medium",
        contentType: validation.data.contentType || "Thought Leadership",
        language: validation.data.language || "English",
        imageUrl: validation.data.imageUrl || null,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        tone: updated.tone,
        audience: updated.audience,
        length: updated.length,
        contentType: updated.contentType,
        language: updated.language,
        imageUrl: updated.imageUrl,
      },
    });
  } catch (error) {
    console.error("PUT preferences error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
