"use client";

import React from "react";

interface PostHashtagsProps {
  hashtags: string[];
}

export const PostHashtags: React.FC<PostHashtagsProps> = ({ hashtags }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {hashtags.map((tag, idx) => (
        <span key={idx} className="text-[#004979] font-bold text-[14px] bg-[#74b9ff]/20 px-2 py-0.5 border-[1.5px] border-[#004979]">
          {tag.startsWith("#") ? tag : `#${tag}`}
        </span>
      ))}
    </div>
  );
};
