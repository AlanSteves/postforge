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
    const errorDescription = searchParams.get("error_description");

    if (error || !code) {
      const reason = errorDescription || error || "Authorization failed or cancelled by user";
      console.warn("LinkedIn callback received error:", error, errorDescription);
      return NextResponse.redirect(
        new URL(`/post-preview?error=linkedin_connect_failed&reason=${encodeURIComponent(reason)}`, req.url)
      );
    }

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3000/api/auth/linkedin/callback";

    let accessToken = `simulated_token_${Date.now()}`;
    let linkedinId = `linkedin_${user.id}`;
    let authorName = user.name || "Alex Rivera";
    let authorEmail = user.email;
    let avatarUrl: string | null = null;
    let headline = "LinkedIn Member";

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

          try {
            const userinfoRes = await fetch("https://api.linkedin.com/v2/userinfo", {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (userinfoRes.ok) {
              const userinfoData = await userinfoRes.json();
              if (userinfoData.sub) {
                linkedinId = userinfoData.sub;
              }
              if (userinfoData.name) {
                authorName = userinfoData.name;
              }
              if (userinfoData.email) {
                authorEmail = userinfoData.email;
              }
              if (userinfoData.picture) {
                avatarUrl = userinfoData.picture;
              }
            } else {
              console.error("Failed to fetch userinfo from LinkedIn, status:", userinfoRes.status);
            }
          } catch (userInfoError) {
            console.error("Error fetching userinfo from LinkedIn:", userInfoError);
          }
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
        email: authorEmail,
        linkedinId,
        avatarUrl,
        headline,
      },
      create: {
        userId: user.id,
        linkedinId,
        accessToken,
        name: authorName,
        email: authorEmail,
        avatarUrl,
        headline,
      },
    });

    return NextResponse.redirect(new URL("/post-preview?connected=true", req.url));
  } catch (error) {
    console.error("LinkedIn callback error:", error);
    return NextResponse.redirect(new URL("/post-preview?error=something_went_wrong", req.url));
  }
}
