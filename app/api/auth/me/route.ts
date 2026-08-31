import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Get current user error:", error);
    const msg = error?.message || "Something went wrong";
    return NextResponse.json(
      { success: false, message: `Auth error: ${msg}` },
      { status: 500 }
    );
  }
}
