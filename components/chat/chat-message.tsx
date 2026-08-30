"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "@/context/post-context";
import { UserMessage } from "./user-message";
import { AiMessage } from "./ai-message";

export const ChatMessageComponent: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  if (message.sender === "user") {
    return <UserMessage message={message} />;
  }
  return <AiMessage message={message} />;
};
