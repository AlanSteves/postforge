"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";
import { NeoBadge } from "@/components/common/neo-badge";

const toneOptions = ["Professional", "Casual", "Bold", "Educational", "Storytelling"];

export const ToneSelector: React.FC = () => {
  const { preferences, updatePreferences } = usePostContext();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">palette</span>
        Tone of Voice
      </label>
      <div className="flex flex-wrap gap-2">
        {toneOptions.map((tone) => (
          <NeoBadge
            key={tone}
            selected={preferences.tone === tone}
            variant="primary"
            onClick={() => updatePreferences("tone", tone)}
          >
            {tone}
          </NeoBadge>
        ))}
      </div>
    </div>
  );
};
