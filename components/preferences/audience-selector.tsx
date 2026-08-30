"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";
import { NeoBadge } from "@/components/common/neo-badge";

const audienceOptions = ["Founders", "Developers", "Marketers", "Recruiters", "Business Owners", "General"];

export const AudienceSelector: React.FC = () => {
  const { preferences, updatePreferences } = usePostContext();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">groups</span>
        Target Audience
      </label>
      <div className="flex flex-wrap gap-2">
        {audienceOptions.map((audience) => (
          <NeoBadge
            key={audience}
            selected={preferences.audience === audience}
            variant="primary"
            onClick={() => updatePreferences("audience", audience)}
          >
            {audience}
          </NeoBadge>
        ))}
      </div>
    </div>
  );
};
