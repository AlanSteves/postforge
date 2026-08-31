"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { usePostContext } from "@/context/post-context";
import { LinkedinPostCard } from "./linkedin-post-card";
import { PostActions } from "./post-actions";

export const PostPreview: React.FC = () => {
  const { linkedInAccount, connectLinkedIn, disconnectLinkedIn } = usePostContext();
  const searchParams = useSearchParams();

  const errorParam = searchParams?.get("error");
  const reasonParam = searchParams?.get("reason");
  const connectedParam = searchParams?.get("connected");

  const handleDisconnect = async () => {
    if (confirm("Are you sure you want to disconnect your LinkedIn account?")) {
      await disconnectLinkedIn();
    }
  };

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex flex-col items-center bg-[#FAF9F5]">
      {/* Header Section */}
      <div className="max-w-[700px] w-full mb-8 text-center md:text-left flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#1b1c1a] border-b-[4px] border-[#000000] pb-4 inline-block tracking-tight">
          POST PREVIEW
        </h1>
        <p className="text-base sm:text-lg font-medium text-[#414750] mt-2">
          This is how your post will appear on LinkedIn.
        </p>
      </div>

      {/* Connection Failure Banner */}
      {errorParam && (
        <div className="max-w-[700px] w-full mb-8 p-6 bg-[#ff94b1] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b-[2px] border-[#000000] pb-3">
            <span className="material-symbols-outlined text-2xl text-[#000000] font-black">
              warning
            </span>
            <h3 className="font-black text-xl text-[#000000] uppercase tracking-tight">
              LinkedIn Connection Failed
            </h3>
          </div>
          <p className="text-sm font-bold text-[#1b1c1a] leading-relaxed">
            The LinkedIn OAuth authorization could not be completed.
            {reasonParam && (
              <span className="block mt-1 font-mono text-xs bg-[#ffffff]/80 p-2 border-[2px] border-[#000000] rounded-none text-[#d63031]">
                Reason: {reasonParam}
              </span>
            )}
          </p>
          <p className="text-xs font-semibold text-[#2d3436]">
            Tip: If you are running locally without a verified LinkedIn Developer App, click <strong>Use Demo Account</strong> to test post creation, formatting, and publishing instantly!
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => connectLinkedIn(true)}
              className="px-5 py-2.5 border-[3px] border-[#000000] bg-[#55E6C1] hover:bg-[#34ace0] text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              Use Demo Account (Instant)
            </button>
            <button
              onClick={() => connectLinkedIn(false)}
              className="px-5 py-2.5 border-[3px] border-[#000000] bg-[#ffffff] hover:bg-[#FAF9F5] text-black text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              Retry Real LinkedIn OAuth
            </button>
          </div>
        </div>
      )}

      {/* Connection Success Banner */}
      {connectedParam === "true" && !errorParam && (
        <div className="max-w-[700px] w-full mb-8 p-6 bg-[#55E6C1] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-black text-lg text-[#1b1c1a] uppercase tracking-tight">
              🎉 LinkedIn Account Linked
            </h3>
            <p className="text-sm font-bold text-[#1b1c1a] mt-1 leading-snug">
              Your account has been connected as <strong>{linkedInAccount.authorName}</strong>. You are ready to preview and publish!
            </p>
          </div>
        </div>
      )}

      {/* Standard LinkedIn Connection Status Banner (when no error and not connected) */}
      {!errorParam && !linkedInAccount.isConnected && (
        <div className="max-w-[700px] w-full mb-8 p-6 bg-[#ffe173] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-black text-lg text-[#1b1c1a] uppercase tracking-tight">LinkedIn Disconnected</h3>
            <p className="text-sm font-semibold text-[#414750] mt-1 leading-snug">
              Connect your LinkedIn account to preview with your profile details and publish posts directly from PostForge.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => connectLinkedIn(false)}
              className="px-4 py-2.5 border-[3px] border-[#000000] bg-[#ffffff] hover:bg-[#FAF9F5] text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              Connect Real Account
            </button>
            <button
              onClick={() => connectLinkedIn(true)}
              className="px-4 py-2.5 border-[3px] border-[#000000] bg-[#55E6C1] hover:bg-[#34ace0] text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer"
            >
              Demo Account
            </button>
          </div>
        </div>
      )}

      {/* Connected Account Banner */}
      {!errorParam && linkedInAccount.isConnected && !connectedParam && (
        <div className="max-w-[700px] w-full mb-8 p-6 bg-[#74b9ff]/20 border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-black text-lg text-[#004979] uppercase tracking-tight">LinkedIn Account Linked</h3>
            <p className="text-sm font-semibold text-[#414750] mt-1 leading-snug">
              You are connected as <strong className="text-[#1b1c1a]">{linkedInAccount.authorName}</strong>. Ready to publish your post!
            </p>
          </div>
          <button
            onClick={handleDisconnect}
            className="shrink-0 px-5 py-3 border-[3px] border-[#000000] bg-[#ff94b1] hover:bg-[#ff7b9e] text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* LinkedIn Card Preview (Neubrutalist Style) */}
      <LinkedinPostCard />

      {/* Action Buttons */}
      <PostActions />
    </main>
  );
};
