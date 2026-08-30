"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface PostData {
  id: string;
  content: string;
  authorName: string;
  authorHeadline: string;
  authorAvatar: string;
  hashtags: string[];
  createdAt: string;
  likes: number;
  comments: number;
  reposts: number;
  status?: string;
  imageUrl?: string | null;
}

const defaultPost: PostData = {
  id: "post-1",
  content: `The biggest lie in small business? "Build it and they will come."

I spent 3 years trying to perfectly craft my product before launching. Zero marketing. Zero audience building.

When I finally launched? Crickets. 🦗

Here’s the harsh reality:
1. Distribution is just as important as the product.
2. Building in public builds a community before you have a customer.
3. Your first version should embarrass you.

Don't wait for perfect. Ship it, talk about it, and iterate.

What’s the biggest lesson you learned the hard way in business? Drop it in the comments below! 👇`,
  authorName: "Alex Rivera",
  authorHeadline: "Founder @ PostForge | Helping SMBs Scale through AI-driven content",
  authorAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBe1MUwvl06PX--f2-qUTHmMy1BbrQoIyv2t2NWjyxrGL-XX4K_qsPKClPxCSklf6Mnx9VdgVSbkHfaW-_ZpmISkSjXykVP1RfStUXnU7PqyXSdcPPliouqTZTIAhwNZsKo_U6CyoJeL6YaTkq2PW8o_MRPMVhFSwle50JcsFuENM7EnMECwToZ7fZoWbRyAtHCt-LRvlEAQk0xXnZa9TS5O_jxGrAjF6mxgXojUZw4GLG0g6uMMI-jRg",
  hashtags: ["#startup", "#buildinginpublic", "#smb", "#founderjourney"],
  createdAt: "Just now",
  likes: 1248,
  comments: 242,
  reposts: 89,
};

export function usePost() {
  const router = useRouter();
  const [currentPost, setCurrentPost] = useState<PostData>(defaultPost);

  const setPostContent = (newContent: string) => {
    setCurrentPost((prev) => ({ ...prev, content: newContent }));
  };

  const setPostData = (post: Partial<PostData>) => {
    setCurrentPost((prev) => ({ ...prev, ...post }));
  };

  const openPostPreview = useCallback((postContent?: string, hashtags?: string[]) => {
    if (postContent) {
      setCurrentPost((prev) => ({
        ...prev,
        content: postContent,
        hashtags: hashtags || prev.hashtags,
      }));
    }
    router.push("/post-preview");
  }, [router]);

  return {
    currentPost,
    setPostContent,
    setPostData,
    openPostPreview,
  };
}
