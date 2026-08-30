"use client";

import React from "react";

interface LinkedinProfileProps {
  name: string;
  headline: string;
  avatar: string;
  createdAt: string;
}

export const LinkedinProfile: React.FC<LinkedinProfileProps> = ({
  name,
  headline,
  avatar,
  createdAt,
}) => {
  return (
    <div className="p-6 border-b-[3px] border-[#000000] flex gap-4 items-start bg-[#FAF9F5]">
      <img
        src={avatar}
        alt={name}
        className="w-14 h-14 rounded-full border-[3px] border-[#000000] object-cover bg-[#ffe173]"
      />
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-[20px] leading-tight text-[#1b1c1a]">{name}</h3>
          <button className="text-[#414750] hover:text-[#1b1c1a] transition-colors">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        <p className="text-[14px] text-[#414750] leading-snug max-w-[85%] mt-1 font-medium">
          {headline}
        </p>
        <div className="flex items-center gap-1 text-[12px] text-[#717881] mt-1 font-medium">
          <span>{createdAt}</span>
          <span>•</span>
          <span className="material-symbols-outlined text-[14px]">public</span>
        </div>
      </div>
    </div>
  );
};
