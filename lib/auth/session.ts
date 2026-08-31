import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/db/prisma";
import { sanitizeUser, SafeUser } from "@/lib/sanitizer";

const SESSION_COOKIE_NAME = "auth_session";
const SESSION_SECRET = process.env.JWT_SECRET || "postforge_secret_jwt_key_2026_super_secure";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;

export interface SessionPayload {
  userId: string;
  iat: number;
  exp: number;
}


export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, SESSION_SECRET, {
    expiresIn: SESSION_DURATION_SECONDS,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });

  return token;
}


export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, SESSION_SECRET) as SessionPayload;
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  } catch (error) {
    return null;
  }
}


export async function requireUser(): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}


export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
