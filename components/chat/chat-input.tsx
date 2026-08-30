"use client";

import React, { useState } from "react";
import { usePostContext } from "@/context/post-context";
import { NeoButton } from "@/components/common/neo-button";
import { ImageUpload } from "./image-upload";

export const ChatInput: React.FC = () => {
  const { generatePost, isGenerating } = usePostContext();
  const [prompt, setPrompt] = useState("");
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    generatePost(prompt);
    setPrompt("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const samplePrompts = [
    "5 hard truths about scaling an SMB with AI",
    "Why your first startup version should embarrass you",
    "How to build a personal brand without spending hours",
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      {/* Sample prompt quick chips */}
      <div className="flex flex-wrap items-center gap-1.5 px-1">
        <span className="text-[11px] font-bold uppercase text-[#717881] mr-1">Try:</span>
        {samplePrompts.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setPrompt(sample)}
            className="text-[11px] font-bold text-[#1b1c1a] bg-[#ffffff] hover:bg-[#ffe173] px-2.5 py-1 border-[2px] border-[#000] shadow-[2px_2px_0px_0px_#000] transition-all truncate max-w-[280px]"
          >
            "{sample}"
          </button>
        ))}
      </div>

      {/* Image attachment collapsible zone */}
      {showImageUpload && (
        <div className="mb-1">
          <ImageUpload />
        </div>
      )}

      {/* Input box container */}
      <div className="bg-[#ffffff] border-[4px] border-[#000000] shadow-[6px_6px_0px_0px_#000000] p-4 flex flex-col gap-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me what you want to post about..."
          rows={3}
          className="w-full bg-transparent text-[#1b1c1a] font-medium text-base placeholder:text-[#717881] focus:outline-none resize-none"
        />

        <div className="flex justify-between items-center pt-2 border-t-[3px] border-[#000000]">
          <button
            type="button"
            onClick={() => setShowImageUpload(!showImageUpload)}
            className={`text-xs font-bold uppercase tracking-wider py-1.5 px-3 border-[2px] border-[#000000] flex items-center gap-1.5 transition-all ${
              showImageUpload
                ? "bg-[#ffe173] text-[#1b1c1a] shadow-[2px_2px_0px_0px_#000]"
                : "bg-[#FAF9F5] text-[#414750] hover:bg-[#efeeea]"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {showImageUpload ? "cancel" : "add_photo_alternate"}
            </span>
            {showImageUpload ? "Hide Attachment" : "+ Image Attachment"}
          </button>

          <NeoButton
            variant="primary"
            size="md"
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="px-6"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin material-symbols-outlined text-sm">sync</span>
                FORGING...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                GENERATE
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            )}
          </NeoButton>
        </div>
      </div>
    </form>
  );
};
