import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { sanitizeLinkedInAccount } from "@/lib/sanitizer";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const account = await prisma.linkedInAccount.findUnique({
      where: { userId: user.id },
    });

    if (!account) {
      return NextResponse.json({
        success: true,
        data: {
          isConnected: false,
          authorName: user.name || "Alex Rivera",
          authorHeadline: "Founder @ PostForge | Helping SMBs Scale through AI-driven content",
          authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe1MUwvl06PX--f2-qUTHmMy1BbrQoIyv2t2NWjyxrGL-XX4K_qsPKClPxCSklf6Mnx9VdgVSbkHfaW-_ZpmISkSjXykVP1RfStUXnU7PqyXSdcPPliouqTZTIAhwNZsKo_U6CyoJeL6YaTkq2PW8o_MRPMVhFSwle50JcsFuENM7EnMECwToZ7fZoWbRyAtHCt-LRvlEAQk0xXnZa9TS5O_jxGrAjF6mxgXojUZw4GLG0g6uMMI-jRg",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: sanitizeLinkedInAccount(account),
    });
  } catch (error) {
    console.error("GET LinkedIn account error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
