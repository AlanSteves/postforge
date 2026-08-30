"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";
import { NeoBadge } from "@/components/common/neo-badge";

const contentTypeOptions = [
  "Thought Leadership",
  "Educational",
  "Story",
  "List",
  "Announcement",
  "Question",
];

export const ContentTypeSelector: React.FC = () => {
  const { preferences, updatePreferences } = usePostContext();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">category</span>
        Content Type
      </label>
      <div className="flex flex-wrap gap-2">
        {contentTypeOptions.map((type) => (
          <NeoBadge
            key={type}
            selected={preferences.contentType === type}
            variant="primary"
            onClick={() => updatePreferences("contentType", type)}
          >
            {type}
          </NeoBadge>
        ))}
      </div>
    </div>
  );
};
