"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";
import { NeoBadge } from "@/components/common/neo-badge";

const lengthOptions = ["Short", "Medium", "Long"];

export const LengthSelector: React.FC = () => {
  const { preferences, updatePreferences } = usePostContext();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">straighten</span>
        Post Length
      </label>
      <div className="flex flex-wrap gap-2">
        {lengthOptions.map((length) => (
          <NeoBadge
            key={length}
            selected={preferences.length === length}
            variant="primary"
            onClick={() => updatePreferences("length", length)}
          >
            {length}
          </NeoBadge>
        ))}
      </div>
    </div>
  );
};
