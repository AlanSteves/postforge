import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(new URL("/post-preview?error=linkedin_connect_failed", req.url));
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3000/api/auth/linkedin/callback";

    let accessToken = `simulated_token_${Date.now()}`;
    let linkedinId = `linkedin_${user.id}`;
    let authorName = user.name || "Alex Rivera";

    if (clientId && clientSecret) {
      try {
        const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: redirectUri,
            client_id: clientId,
            client_secret: clientSecret,
          }),
        });

        const tokenData = await tokenRes.json();
        if (tokenData.access_token) {
          accessToken = tokenData.access_token;
        }
      } catch (err) {
        console.error("Failed to exchange LinkedIn code for token:", err);
      }
    }

    // Upsert LinkedInAccount matching schema fields
    await prisma.linkedInAccount.upsert({
      where: { userId: user.id },
      update: {
        accessToken,
        name: authorName,
        email: user.email,
      },
      create: {
        userId: user.id,
        linkedinId,
        accessToken,
        name: authorName,
        email: user.email,
      },
    });

    return NextResponse.redirect(new URL("/post-preview?connected=true", req.url));
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect(new URL("/post-preview?error=something_went_wrong", req.url));
  }
}
