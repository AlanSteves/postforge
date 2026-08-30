"use client";

import React from "react";
import { ChatMessage } from "@/context/post-context";

export const UserMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className="flex flex-col items-end gap-1.5 max-w-[85%] sm:max-w-[75%] ml-auto">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-[#717881]">{message.timestamp}</span>
        <span className="text-xs font-black uppercase text-[#1b1c1a]">You</span>
      </div>
      <div className="bg-[#ffe173] text-[#1b1c1a] border-[3px] border-[#000000] p-4 shadow-[4px_4px_0px_0px_#000000] font-medium text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
        {message.text}
        {message.imagePreview && (
          <div className="mt-3 pt-3 border-t-[2px] border-[#000000]">
            <img
              src={message.imagePreview}
              alt="Attached Media"
              className="max-h-48 rounded-none border-[2px] border-[#000000] object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};
