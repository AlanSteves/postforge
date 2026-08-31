import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const simulate = searchParams.get("simulate") === "true";

    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || "http://localhost:3000/api/auth/linkedin/callback";

    if (clientId && !simulate) {
      const scopeStr = process.env.LINKEDIN_SCOPES || "openid profile email w_member_social";
      const scope = encodeURIComponent(scopeStr);
      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${user.id}&scope=${scope}`;
      return NextResponse.redirect(linkedinAuthUrl);
    }

    // Dev environment simulated callback
    const simulatedCallbackUrl = new URL(
      `/api/auth/linkedin/callback?code=simulated_code_${Date.now()}&state=${user.id}`,
      redirectUri.startsWith("http") ? redirectUri : "http://localhost:3000"
    );

    return NextResponse.redirect(simulatedCallbackUrl);
  } catch (error) {
    console.error("LinkedIn connect error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
