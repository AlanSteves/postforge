import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json(
      { success: true, message: "Signed out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
