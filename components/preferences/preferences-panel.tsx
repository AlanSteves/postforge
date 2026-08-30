"use client";

import React from "react";
import { ToneSelector } from "./tone-selector";
import { AudienceSelector } from "./audience-selector";
import { LengthSelector } from "./length-selector";
import { ContentTypeSelector } from "./content-type-selector";
import { LanguageSelector } from "./language-selector";

interface PreferencesPanelProps {
  onCloseMobile?: () => void;
}

export const PreferencesPanel: React.FC<PreferencesPanelProps> = ({ onCloseMobile }) => {
  return (
    <div className="bg-[#FAF9F5] border-[3px] border-[#000000] shadow-[5px_5px_0px_0px_#000000] p-5 flex flex-col gap-6">
      <div className="flex justify-between items-center border-b-[3px] border-[#000000] pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-[#0062a0]">tune</span>
          <h3 className="font-black text-lg uppercase tracking-tight text-[#1b1c1a]">
            POST PREFERENCES
          </h3>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1 border-[2px] border-[#000000] bg-[#ffffff] hover:bg-[#efeeea]"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <ToneSelector />
        <AudienceSelector />
        <LengthSelector />
        <ContentTypeSelector />
        <LanguageSelector />
      </div>

      <div className="mt-2 pt-4 border-t-[3px] border-[#000000] bg-[#74b9ff]/10 p-3 border-[2px] border-[#0062a0]">
        <p className="text-xs font-semibold text-[#004979] flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm">info</span>
          Preferences automatically tune AI output structure & hashtag style.
        </p>
      </div>
    </div>
  );
};
