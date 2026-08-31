"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, SafeUser } from "@/lib/hooks/use-auth";
import { usePreferences, Preferences } from "@/lib/hooks/use-preferences";
import { useChat, ChatMessage } from "@/lib/hooks/use-chat";
import { usePost, PostData } from "@/lib/hooks/use-post";
import { useLinkedIn, LinkedInAccountInfo } from "@/lib/hooks/use-linkedin";

export interface PostPreferences extends Preferences {}
export type { ChatMessage, PostData };

interface PostContextType {
  user: SafeUser | null;
  authLoading: boolean;
  currentPost: PostData;
  preferences: PostPreferences;
  messages: ChatMessage[];
  recentSearches: string[];
  attachedImage: string | null;
  isGenerating: boolean;
  linkedInAccount: LinkedInAccountInfo;
  isPublishingLinkedIn: boolean;
  setAttachedImage: (img: string | null) => void;
  updatePreferences: (key: keyof PostPreferences, value: string) => void;
  generatePost: (prompt: string) => void;
  selectSearch: (topic: string) => void;
  updatePostContent: (content: string) => void;
  clearMessages: () => void;
  signin: (email: string, pass: string) => Promise<boolean>;
  signup: (data: any) => Promise<boolean>;
  signout: () => Promise<void>;
  publishToLinkedIn: () => Promise<boolean>;
  connectLinkedIn: (simulate?: boolean) => void;
  disconnectLinkedIn: () => Promise<boolean>;
  openPostPreview: (content?: string, hashtags?: string[]) => void;
  formatMessageToPost: (messageId: string, content?: string) => Promise<any>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading, signin, signup, signout } = useAuth();
  const { preferences, updatePreference } = usePreferences();
  const {
    conversations,
    messages,
    isGenerating,
    sendMessage,
    formatMessageToPost,
    startNewChat,
    clearMessages,
  } = useChat();
  const { currentPost, setPostContent, setPostData, openPostPreview } = usePost();
  const {
    account: linkedInAccount,
    isPublishing: isPublishingLinkedIn,
    publishPost,
    connect: connectLinkedIn,
    disconnect: disconnectLinkedIn,
  } = useLinkedIn();

  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  // Sync author profile from authenticated user & LinkedIn account
  useEffect(() => {
    if (user) {
      setPostData({
        authorName: linkedInAccount.authorName || user.name || "Alex Rivera",
        authorHeadline: linkedInAccount.authorHeadline || "Founder @ PostForge | Helping SMBs Scale through AI-driven content",
        authorAvatar: linkedInAccount.authorAvatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBe1MUwvl06PX--f2-qUTHmMy1BbrQoIyv2t2NWjyxrGL-XX4K_qsPKClPxCSklf6Mnx9VdgVSbkHfaW-_ZpmISkSjXykVP1RfStUXnU7PqyXSdcPPliouqTZTIAhwNZsKo_U6CyoJeL6YaTkq2PW8o_MRPMVhFSwle50JcsFuENM7EnMECwToZ7fZoWbRyAtHCt-LRvlEAQk0xXnZa9TS5O_jxGrAjF6mxgXojUZw4GLG0g6uMMI-jRg",
      });
    }
  }, [user, linkedInAccount]);

  const recentSearches = conversations.length > 0
    ? conversations.map((c) => c.title)
    : [
        "AI in small business",
        "Startup marketing",
        "Personal branding",
        "Future of technology",
        "Remote work culture",
      ];

  const updatePreferencesHandler = (key: keyof PostPreferences, value: string) => {
    updatePreference(key, value);
  };

  const generatePostHandler = async (prompt: string) => {
    if (!prompt.trim()) return;
    await sendMessage(prompt, attachedImage);
    setAttachedImage(null);
  };

  const selectSearchHandler = (topic: string) => {
    generatePostHandler(`Write a post about ${topic}`);
  };

  const publishToLinkedInHandler = async (): Promise<boolean> => {
    return await publishPost(currentPost.id, currentPost.content);
  };

  return (
    <PostContext.Provider
      value={{
        user,
        authLoading,
        currentPost,
        preferences,
        messages,
        recentSearches,
        attachedImage,
        isGenerating,
        linkedInAccount,
        isPublishingLinkedIn,
        setAttachedImage,
        updatePreferences: updatePreferencesHandler,
        generatePost: generatePostHandler,
        selectSearch: selectSearchHandler,
        updatePostContent: setPostContent,
        clearMessages,
        signin,
        signup,
        signout,
        publishToLinkedIn: publishToLinkedInHandler,
        connectLinkedIn,
        disconnectLinkedIn,
        openPostPreview,
        formatMessageToPost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePostContext must be used within a PostProvider");
  }
  return context;
};
