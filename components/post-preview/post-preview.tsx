"use client";

import React from "react";
import { LinkedinPostCard } from "./linkedin-post-card";
import { PostActions } from "./post-actions";

export const PostPreview: React.FC = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-12 flex flex-col items-center bg-[#FAF9F5]">
      {/* Header Section */}
      <div className="max-w-[700px] w-full mb-8 text-center md:text-left flex flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase text-[#1b1c1a] border-b-[4px] border-[#000000] pb-4 inline-block tracking-tight">
          POST PREVIEW
        </h1>
        <p className="text-base sm:text-lg font-medium text-[#414750] mt-2">
          This is how your post will appear on LinkedIn.
        </p>
      </div>

      {/* LinkedIn Card Preview (Neubrutalist Style) */}
      <LinkedinPostCard />

      {/* Action Buttons */}
      <PostActions />
    </main>
  );
};
