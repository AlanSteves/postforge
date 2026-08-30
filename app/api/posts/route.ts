import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required"),
  conversationId: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  imageUrl: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "READY", "PUBLISHED", "FAILED"]).optional(),
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

    const posts = await prisma.post.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("GET posts error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, message: "Invalid post payload" },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        userId: user.id,
        content: validation.data.content,
        conversationId: validation.data.conversationId || null,
        hashtags: validation.data.hashtags || [],
        imageUrl: validation.data.imageUrl || null,
        status: validation.data.status || "DRAFT",
      },
    });

    return NextResponse.json(
      { success: true, data: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST post error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
