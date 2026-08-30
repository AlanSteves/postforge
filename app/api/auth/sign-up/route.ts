import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/auth/session";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = signUpSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || "Invalid sign up data";
      return NextResponse.json(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check email uniqueness
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password & create user with default preferences
    const passwordHash = await hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email: lowerEmail,
        passwordHash,
        preference: {
          create: {
            tone: "Bold",
            audience: "Founders",
            length: "Medium",
            contentType: "Thought Leadership",
            language: "English",
          },
        },
      },
    });

    // Create session cookie
    await createSession(newUser.id);

    return NextResponse.json(
      { success: true, message: "Account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
