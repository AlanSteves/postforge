"use client";

import { useState, useEffect, useCallback } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  imagePreview?: string | null;
}

export interface ConversationSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export function useChat() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/conversations");
      const json = await res.json().catch(() => ({}));
      if (json.success && Array.isArray(json.data)) {
        setConversations(json.data);
      }
    } catch (err) {
      console.error("Fetch conversations error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConversationDetail = useCallback(async (id: string) => {
    try {
      setActiveConversationId(id);
      const res = await fetch(`/api/conversations/${id}`);
      const json = await res.json().catch(() => ({}));
      if (json.success && json.data?.messages) {
        const formattedMsgs: ChatMessage[] = json.data.messages.map((m: any) => ({
          id: m.id,
          sender: m.role === "USER" ? "user" : "ai",
          text: m.content,
          timestamp: new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          imagePreview: m.imagePreview || null,
        }));
        setMessages(formattedMsgs);
      }
    } catch (err) {
      console.error("Load conversation detail error:", err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const startNewChat = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      const json = await res.json().catch(() => ({}));
      if (json.success && json.data) {
        setActiveConversationId(json.data.id);
        setMessages([]);
        fetchConversations();
      }
    } catch (err) {
      console.error("Start new chat error:", err);
    }
  };

  const sendMessage = async (prompt: string, imagePreview?: string | null) => {
    if (!prompt.trim()) return null;

    const userTempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: "user",
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imagePreview: imagePreview || null,
    };

    setMessages((prev) => [...prev, userTempMsg]);
    setIsGenerating(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          conversationId: activeConversationId || undefined,
          imagePreview: imagePreview || null,
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        const { conversationId, assistantMessage, post } = json.data;
        if (conversationId) setActiveConversationId(conversationId);

        const aiMsgText = assistantMessage.content || assistantMessage.text || "Post generated successfully.";
        const aiMsg: ChatMessage = {
          id: assistantMessage.id || `ai-${Date.now()}`,
          sender: "ai",
          text: aiMsgText,
          timestamp: new Date(assistantMessage.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [
          ...prev.filter((m) => m.id !== userTempMsg.id),
          {
            ...userTempMsg,
            id: json.data.userMessage?.id || userTempMsg.id,
          },
          aiMsg,
        ]);

        fetchConversations();
        return post;
      }
    } catch (err) {
      console.error("Send message error:", err);
    } finally {
      setIsGenerating(false);
    }

    // Fallback response if network or server error occurs
    const fallbackText = `The biggest lie in small business? "Build it and they will come."\n\nHere are 3 harsh realities every founder needs to internalize:\n\n1. Distribution is just as crucial as product development.\n2. Building in public creates your customer base before launch.\n3. Perfection is the enemy of momentum.\n\n${prompt}\n\nWhat’s the single biggest lesson you learned the hard way? Let's discuss in the comments below! 👇\n\n#startup #buildinginpublic #ai #innovation`;
    
    const fallbackAiMsg: ChatMessage = {
      id: `ai-fallback-${Date.now()}`,
      sender: "ai",
      text: fallbackText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, fallbackAiMsg]);
    setIsGenerating(false);
    return null;
  };

  return {
    conversations,
    activeConversationId,
    messages,
    isGenerating,
    loading,
    sendMessage,
    startNewChat,
    loadConversationDetail,
    refreshConversations: fetchConversations,
    clearMessages: () => setMessages([]),
  };
}
