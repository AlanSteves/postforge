"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatMessage, usePostContext } from "@/context/post-context";

export const AiMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const router = useRouter();
  const { updatePostContent } = usePostContext();
  const [copied, setCopied] = useState(false);

  const handleDoubleClick = () => {
    updatePostContent(message.text);
    router.push("/post-preview");
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePostContent(message.text);
    router.push("/post-preview");
  };

  return (
    <div className="flex flex-col items-start gap-1.5 max-w-[90%] sm:max-w-[85%] mr-auto group">
      {/* Sender indicator */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-[#74b9ff] border-[2px] border-[#000] flex items-center justify-center">
          <span className="material-symbols-outlined text-xs text-[#004979] font-black">
            auto_awesome
          </span>
        </div>
        <span className="text-xs font-black uppercase text-[#1b1c1a]">PostForge AI</span>
        <span className="text-[11px] font-bold text-[#717881]">{message.timestamp}</span>
      </div>

      {/* Main Response Box with double click interaction */}
      <div
        onDoubleClick={handleDoubleClick}
        title="Double-click to preview this post on LinkedIn"
        className="w-full bg-[#ffffff] text-[#1b1c1a] border-[3px] border-[#000000] p-5 shadow-[5px_5px_0px_0px_#000000] cursor-pointer hover:border-[#0062a0] transition-colors relative group/box"
      >
        <div className="font-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
          {message.text}
        </div>

        {/* Double-Click Hint Banner & Quick Actions */}
        <div className="mt-4 pt-3 border-t-[3px] border-[#000000] flex flex-wrap justify-between items-center gap-2 bg-[#FAF9F5] -mx-5 -mb-5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0062a0]">
            <span className="material-symbols-outlined text-base animate-pulse">touch_app</span>
            <span>DOUBLE-CLICK TO PREVIEW →</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-xs font-bold py-1 px-2.5 border-[2px] border-[#000] bg-[#ffffff] hover:bg-[#ffe173] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-xs">
                {copied ? "check" : "content_copy"}
              </span>
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={handlePreviewClick}
              className="text-xs font-bold py-1 px-3 border-[2px] border-[#000] bg-[#74b9ff] text-[#004979] hover:bg-[#62a7ed] shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1"
            >
              <span>Preview →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
