"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";

export const RecentSearches: React.FC = () => {
  const { recentSearches, selectSearch } = usePostContext();

  return (
    <div className="flex flex-col gap-2 bg-[#FAF9F5] border-[3px] border-[#000000] shadow-[4px_4px_0px_0px_#000000] p-4">
      <div className="flex items-center gap-2 border-b-[2.5px] border-[#000000] pb-2">
        <span className="material-symbols-outlined text-base text-[#0062a0]">history</span>
        <h4 className="font-bold text-xs uppercase tracking-wider text-[#1b1c1a]">
          Recent Searches
        </h4>
      </div>
      <div className="flex flex-col gap-1.5 mt-1">
        {recentSearches.map((topic, index) => (
          <button
            key={index}
            onClick={() => selectSearch(topic)}
            className="text-left font-semibold text-xs text-[#1b1c1a] p-2 bg-[#ffffff] border-[2px] border-[#000000] hover:bg-[#ffe173] hover:shadow-[2px_2px_0px_0px_#000000] transition-all truncate"
          >
            # {topic}
          </button>
        ))}
      </div>
    </div>
  );
};
