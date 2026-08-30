"use client";

import React, { useState } from "react";
import { usePostContext } from "@/context/post-context";
import { LinkedinProfile } from "./linkedin-profile";
import { PostContent } from "./post-content";

export const LinkedinPostCard: React.FC = () => {
  const { currentPost } = usePostContext();
  const [likesCount, setLikesCount] = useState(currentPost.likes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="max-w-[700px] w-full bg-[#ffffff] border-[4px] border-[#000000] shadow-[8px_8px_0px_0px_#000000] rounded-none p-0 overflow-hidden flex flex-col mb-8 transform transition-transform hover:-translate-y-1">
      {/* Card Header (Author Info) */}
      <LinkedinProfile
        name={currentPost.authorName}
        headline={currentPost.authorHeadline}
        avatar={currentPost.authorAvatar}
        createdAt={currentPost.createdAt}
      />

      {/* Card Body (Post Text & Hashtags) */}
      <PostContent />

      {/* Engagement Stats */}
      <div className="px-6 py-3 border-t-[3px] border-[#000000] flex justify-between items-center bg-[#f4f4f0] text-[#414750] text-[14px]">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-[#74b9ff] flex items-center justify-center border border-[#000000] z-20">
              <span className="material-symbols-outlined text-[#004979] text-[12px] font-bold">
                thumb_up
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#E0245E] flex items-center justify-center border border-[#000000] z-10">
              <span className="material-symbols-outlined text-white text-[12px] font-bold">
                favorite
              </span>
            </div>
            <div className="w-5 h-5 rounded-full bg-[#705d00] flex items-center justify-center border border-[#000000] z-0">
              <span className="material-symbols-outlined text-white text-[12px] font-bold">
                lightbulb
              </span>
            </div>
          </div>
          <span className="font-bold text-[#1b1c1a]">{likesCount.toLocaleString()}</span>
        </div>
        <div className="flex gap-3 font-semibold text-xs hover:underline cursor-pointer">
          <span>{currentPost.comments} Comments</span>
          <span>•</span>
          <span>{currentPost.reposts} Reposts</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="px-2 py-2 border-t-[3px] border-[#000000] flex justify-between bg-[#FAF9F5]">
        <button
          onClick={handleLike}
          className={`flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#efeeea] transition-colors rounded-none font-bold text-[#1b1c1a] text-[15px] cursor-pointer ${
            hasLiked ? "bg-[#74b9ff]/30 text-[#004979]" : ""
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">thumb_up</span>
          Like
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#efeeea] transition-colors rounded-none font-bold text-[#1b1c1a] text-[15px] cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">chat_bubble_outline</span>
          Comment
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#efeeea] transition-colors rounded-none font-bold text-[#1b1c1a] text-[15px] cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">repeat</span>
          Repost
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 hover:bg-[#efeeea] transition-colors rounded-none font-bold text-[#1b1c1a] text-[15px] cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">send</span>
          Send
        </button>
      </div>
    </div>
  );
};
