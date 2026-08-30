import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | PostForge AI",
  description: "Privacy Policy for PostForge AI LinkedIn integration and data usage.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "August 30, 2026";

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1b1c1a] p-4 sm:p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full flex flex-col gap-6">
        {/* Header */}
        <div className="bg-[#74b9ff] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] p-6">
          <Link
            href="/chat"
            className="inline-flex items-center gap-1 text-xs font-black uppercase text-[#004979] hover:underline mb-2"
          >
            ← BACK TO APP
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#1b1c1a]">
            PRIVACY POLICY
          </h1>
          <p className="text-xs font-bold text-[#004979] mt-1">
            PostForge AI — Last Updated: {lastUpdated}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-[#ffffff] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] p-6 sm:p-8 flex flex-col gap-6 font-medium text-sm sm:text-base leading-relaxed">
          <section className="flex flex-col gap-2 border-b-[3px] border-[#000000] pb-4">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              1. Overview & Information We Collect
            </h2>
            <p className="text-[#414750]">
              PostForge AI ("we", "our", "us") operates the PostForge AI LinkedIn assistant platform. We value your privacy and are committed to protecting your personal data in full compliance with global privacy regulations and LinkedIn Developer Policies.
            </p>
            <p className="text-[#414750]">
              When you connect your LinkedIn account or register on PostForge AI, we collect:
            </p>
            <ul className="list-disc list-inside pl-2 text-[#1b1c1a] font-bold flex flex-col gap-1">
              <li>Account Credentials: Name, email address, and encrypted passwords.</li>
              <li>LinkedIn Account Data: Name, headline, profile image URL, and LinkedIn member ID via OAuth 2.0.</li>
              <li>Generated Content: Post drafts, prompt history, and user preferences.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2 border-b-[3px] border-[#000000] pb-4">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              2. How We Use LinkedIn Member Data
            </h2>
            <p className="text-[#414750]">
              We request access to LinkedIn member data exclusively to provide core functionality:
            </p>
            <ul className="list-disc list-inside pl-2 text-[#1b1c1a] font-bold flex flex-col gap-1">
              <li>Authenticating your account via LinkedIn OAuth.</li>
              <li>Displaying your LinkedIn profile preview when reviewing AI-generated posts.</li>
              <li>Publishing user-approved posts directly to your LinkedIn profile upon your explicit request.</li>
            </ul>
            <div className="bg-[#ffe173]/30 border-[2px] border-[#000000] p-3 text-xs font-bold text-[#1b1c1a] mt-2">
              🔒 We NEVER post to LinkedIn automatically without your explicit consent or click of the "Post It" button.
            </div>
          </section>

          <section className="flex flex-col gap-2 border-b-[3px] border-[#000000] pb-4">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              3. Data Storage & Security
            </h2>
            <p className="text-[#414750]">
              Your security is paramount:
            </p>
            <ul className="list-disc list-inside pl-2 text-[#414750] flex flex-col gap-1">
              <li>LinkedIn access tokens are stored securely in backend databases and are <strong>never</strong> transmitted to client-side code or browser local storage.</li>
              <li>Passwords are hashed using industry-standard bcrypt algorithm.</li>
              <li>Sessions are managed strictly via HTTP-only, secure cookies.</li>
            </ul>
          </section>

          <section className="flex flex-col gap-2 border-b-[3px] border-[#000000] pb-4">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              4. Data Sharing & Third Parties
            </h2>
            <p className="text-[#414750]">
              We do <strong>not</strong> sell, rent, or trade your personal data or LinkedIn information to third parties or advertising networks. OpenAI APIs used for content generation process prompts anonymously and do not retain user content for AI model training.
            </p>
          </section>

          <section className="flex flex-col gap-2 border-b-[3px] border-[#000000] pb-4">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              5. Data Retention & Account Disconnection
            </h2>
            <p className="text-[#414750]">
              You can disconnect your LinkedIn account at any time via your account settings. Upon disconnection or account deletion, all stored OAuth tokens and associated profile data are permanently erased from our databases.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-black uppercase text-[#1b1c1a]">
              6. Contact Us
            </h2>
            <p className="text-[#414750]">
              If you have any questions regarding this Privacy Policy or your data, please contact our support team at:
            </p>
            <p className="font-bold text-[#0062a0]">
              support@postforge.ai
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-bold text-[#717881]">
          © {new Date().getFullYear()} PostForge AI. All rights reserved.
        </div>
      </div>
    </div>
  );
}
