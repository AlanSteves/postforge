import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete the LinkedInAccount associated with this user
    await prisma.linkedInAccount.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      message: "LinkedIn account disconnected successfully",
    });
  } catch (error) {
    console.error("POST LinkedIn disconnect error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
