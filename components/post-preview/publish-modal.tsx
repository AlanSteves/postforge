"use client";

import React, { useState } from "react";
import { NeoButton } from "@/components/common/neo-button";
import { usePostContext } from "@/context/post-context";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { publishToLinkedIn, isPublishingLinkedIn, linkedInAccount, connectLinkedIn } = usePostContext();
  const [published, setPublished] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePost = async () => {
    setErrorMsg(null);
    try {
      const success = await publishToLinkedIn();
      if (success) {
        setPublished(true);
      } else {
        setErrorMsg("Failed to publish to LinkedIn. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An error occurred while publishing.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#000000]/70 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 max-w-[480px] w-full bg-[#ffffff] border-[4px] border-[#000000] shadow-[10px_10px_0px_0px_#000000] p-6 sm:p-8">
        {!published ? (
          !linkedInAccount.isConnected ? (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start border-b-[3px] border-[#000000] pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-[#0062a0]">
                    link
                  </span>
                  <h3 className="font-black text-xl uppercase tracking-tight text-[#1b1c1a]">
                    CONNECT LINKEDIN
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 border-[2px] border-[#000] bg-[#FAF9F5] hover:bg-[#ff94b1]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              <p className="text-base font-semibold text-[#414750] leading-relaxed">
                Your LinkedIn account is not connected. Connect PostForge to your profile to publish this post.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <NeoButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={onClose}
                >
                  CANCEL
                </NeoButton>
                <NeoButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={() => connectLinkedIn()}
                >
                  CONNECT NOW →
                </NeoButton>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start border-b-[3px] border-[#000000] pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-2xl text-[#0062a0]">
                    send
                  </span>
                  <h3 className="font-black text-xl uppercase tracking-tight text-[#1b1c1a]">
                    READY TO PUBLISH?
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 border-[2px] border-[#000] bg-[#FAF9F5] hover:bg-[#ff94b1]"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>

              {errorMsg && (
                <div className="bg-[#ff94b1] border-[3px] border-[#000000] p-3 text-xs font-bold text-[#1b1c1a]">
                  ⚠️ {errorMsg}
                </div>
              )}

              <p className="text-base font-semibold text-[#414750] leading-relaxed">
                This post will be published publicly to your connected LinkedIn account (<strong>{linkedInAccount.authorName}</strong>).
              </p>

              <div className="bg-[#ffe173]/20 border-[2px] border-[#000000] p-3 text-xs font-bold text-[#1b1c1a] flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-[#705d00]">warning</span>
                Make sure you reviewed post formatting and hashtags before confirming!
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <NeoButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={onClose}
                  disabled={isPublishingLinkedIn}
                >
                  CANCEL
                </NeoButton>
                <NeoButton
                  variant="primary"
                  size="md"
                  className="flex-1"
                  onClick={handlePost}
                  disabled={isPublishingLinkedIn}
                >
                  {isPublishingLinkedIn ? "PUBLISHING..." : "POST IT →"}
                </NeoButton>
              </div>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center text-center gap-5 py-4">
            <div className="w-16 h-16 bg-[#55E6C1] border-[3px] border-[#000000] shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl text-[#000000] font-black">
                check
              </span>
            </div>
            <h3 className="font-black text-2xl uppercase tracking-tight text-[#1b1c1a]">
              SUCCESSFULLY PUBLISHED!
            </h3>
            <p className="text-sm font-bold text-[#414750]">
              Your post is now live on LinkedIn. You can track impressions & analytics in your dashboard.
            </p>
            <NeoButton
              variant="accent"
              size="md"
              fullWidth
              onClick={() => {
                setPublished(false);
                onConfirm();
              }}
            >
              BACK TO WORKSPACE →
            </NeoButton>
          </div>
        )}
      </div>
    </div>
  );
};
