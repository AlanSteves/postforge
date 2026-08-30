"use client";

import React from "react";
import { usePostContext } from "@/context/post-context";
import { NeoBadge } from "@/components/common/neo-badge";

const languageOptions = ["English", "Tamil", "Hindi", "Other"];

export const LanguageSelector: React.FC = () => {
  const { preferences, updatePreferences } = usePostContext();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-[#1b1c1a] flex items-center gap-1.5">
        <span className="material-symbols-outlined text-sm">translate</span>
        Output Language
      </label>
      <div className="flex flex-wrap gap-2">
        {languageOptions.map((lang) => (
          <NeoBadge
            key={lang}
            selected={preferences.language === lang}
            variant="primary"
            onClick={() => updatePreferences("language", lang)}
          >
            {lang}
          </NeoBadge>
        ))}
      </div>
    </div>
  );
};
