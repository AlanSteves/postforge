"use client";

import { useState, useEffect, useCallback } from "react";

export interface LinkedInAccountInfo {
  isConnected: boolean;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
}

export function useLinkedIn() {
  const [account, setAccount] = useState<LinkedInAccountInfo>({
    isConnected: false,
    authorName: "Alex Rivera",
    authorHeadline: "Founder @ PostForge | Helping SMBs Scale through AI-driven content",
    authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe1MUwvl06PX--f2-qUTHmMy1BbrQoIyv2t2NWjyxrGL-XX4K_qsPKClPxCSklf6Mnx9VdgVSbkHfaW-_ZpmISkSjXykVP1RfStUXnU7PqyXSdcPPliouqTZTIAhwNZsKo_U6CyoJeL6YaTkq2PW8o_MRPMVhFSwle50JcsFuENM7EnMECwToZ7fZoWbRyAtHCt-LRvlEAQk0xXnZa9TS5O_jxGrAjF6mxgXojUZw4GLG0g6uMMI-jRg",
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLinkedInAccount = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/linkedin/account");
      const json = await res.json();
      if (json.success && json.data) {
        setAccount(json.data);
      }
    } catch (err) {
      console.error("Fetch LinkedIn account error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinkedInAccount();
  }, [fetchLinkedInAccount]);

  const connect = () => {
    window.location.href = "/api/auth/linkedin/connect";
  };

  const publishPost = async (postId?: string, content?: string): Promise<boolean> => {
    try {
      setIsPublishing(true);
      const res = await fetch("/api/linkedin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content }),
      });

      const json = await res.json();
      if (json.success) {
        await fetchLinkedInAccount();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Publish post error:", err);
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return {
    account,
    isPublishing,
    loading,
    connect,
    publishPost,
    refreshAccount: fetchLinkedInAccount,
  };
}
