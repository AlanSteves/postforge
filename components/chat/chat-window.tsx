"use client";

import React, { useRef, useEffect } from "react";
import { usePostContext } from "@/context/post-context";
import { ChatMessageComponent } from "./chat-message";
import { ChatInput } from "./chat-input";

export const ChatWindow: React.FC = () => {
  const { messages, isGenerating } = usePostContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAF9F5]">
      {/* Scrollable Chat Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Workspace Intro Card */}
        <div className="bg-[#74b9ff]/10 border-[3px] border-[#000000] shadow-[4px_4px_0px_0px_#000000] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-xs uppercase tracking-widest text-[#004979] bg-[#74b9ff] px-2 py-0.5 border-[1.5px] border-[#000]">
              Natural AI Chat
            </span>
            <p className="text-xs font-semibold text-[#414750] mt-1">
              Ask PostForge AI to write or refine any LinkedIn post. <strong className="text-[#0062a0]">Double-click</strong> any AI response to open full LinkedIn preview.
            </p>
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 bg-[#ffffff] border-[3px] border-[#000000] shadow-[4px_4px_0px_0px_#000000] w-fit">
            <span className="material-symbols-outlined text-[#0062a0] animate-spin">
              auto_awesome
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a]">
              PostForge AI is generating your post...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Chat Input Area at bottom */}
      <div className="p-4 sm:p-6 border-t-[3px] border-[#000000] bg-[#FAF9F5]">
        <ChatInput />
      </div>
    </div>
  );
};
