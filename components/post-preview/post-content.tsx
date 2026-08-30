"use client";

import React, { useState } from "react";
import { usePostContext } from "@/context/post-context";
import { PostHashtags } from "./post-hashtags";

export const PostContent: React.FC = () => {
  const { currentPost, updatePostContent, attachedImage } = usePostContext();
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(currentPost.content);

  const handleSave = () => {
    updatePostContent(text);
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-[#ffffff] flex flex-col gap-4">
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full p-3 border-[3px] border-[#000] text-[#1b1c1a] font-medium text-base focus:outline-none bg-[#FAF9F5]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 border-[2px] border-[#000] font-bold text-xs bg-[#efeeea]"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 border-[2px] border-[#000] font-bold text-xs bg-[#74b9ff] text-[#004979] shadow-[2px_2px_0px_0px_#000]"
            >
              Save Edits
            </button>
          </div>
        </div>
      ) : (
        <div className="relative group">
          <div className="font-normal text-[16px] leading-[1.6] text-[#1b1c1a] space-y-4 whitespace-pre-wrap">
            {currentPost.content}
          </div>
          <button
            onClick={() => {
              setText(currentPost.content);
              setIsEditing(true);
            }}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[#ffe173] text-[#000] border-[2px] border-[#000] px-2.5 py-1 font-bold text-xs shadow-[2px_2px_0px_0px_#000]"
          >
            ✏️ Quick Edit
          </button>
        </div>
      )}

      {/* Optional attached image preview inside LinkedIn card */}
      {attachedImage && (
        <div className="mt-3 border-[3px] border-[#000000] overflow-hidden">
          <img
            src={attachedImage}
            alt="Attached Post Media"
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      <PostHashtags hashtags={currentPost.hashtags} />
    </div>
  );
};
