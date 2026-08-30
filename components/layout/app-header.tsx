"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePostContext } from "@/context/post-context";

interface AppHeaderProps {
  onToggleMobileSidebar?: () => void;
  onToggleMobilePreferences?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onToggleMobileSidebar,
  onToggleMobilePreferences,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { currentPost } = usePostContext();
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const getTitle = () => {
    if (pathname.includes("/chat")) return "Post Forge Workspace";
    if (pathname.includes("/post-preview")) return "LinkedIn Post Preview";
    if (pathname.includes("/sign-in")) return "Sign In";
    if (pathname.includes("/sign-up")) return "Sign Up";
    return "PostForge AI";
  };

  const handleSaveDraft = () => {
    setShowNotificationToast(true);
    setTimeout(() => setShowNotificationToast(false), 3000);
  };

  const handlePublishClick = () => {
    router.push("/post-preview");
  };

  return (
    <header className="w-full h-20 border-b-[3px] border-[#000000] bg-[#FAF9F5] sticky top-0 right-0 z-40 flex justify-between items-center px-4 md:px-8">
      {/* Left side: Mobile menu toggle & page title */}
      <div className="flex items-center gap-3">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden w-10 h-10 flex items-center justify-center border-[3px] border-[#000000] bg-[#ffffff] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
            aria-label="Toggle Navigation"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        )}
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-[#1b1c1a] tracking-tight">
            {getTitle()}
          </h2>
          <span className="hidden md:inline-block text-xs font-semibold text-[#717881]">
            Creator Pro • LinkedIn AI Generator
          </span>
        </div>
      </div>

      {/* Right side: Actions & User Avatar */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Toast alert indicator */}
        {showNotificationToast && (
          <div className="fixed top-24 right-8 bg-[#55E6C1] text-[#000] border-[3px] border-[#000] p-3 shadow-[5px_5px_0px_0px_#000] font-bold text-xs z-50 animate-bounce">
            ✓ Draft saved successfully!
          </div>
        )}

        {/* Mobile preferences drawer toggle button (visible on mobile chat) */}
        {onToggleMobilePreferences && pathname.includes("/chat") && (
          <button
            onClick={onToggleMobilePreferences}
            className="lg:hidden h-10 px-3 flex items-center gap-1 border-[3px] border-[#000000] bg-[#ffe173] text-[#221b00] font-bold text-xs uppercase shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span className="hidden sm:inline">Preferences</span>
          </button>
        )}

        <button
          onClick={() => setShowNotificationToast(true)}
          className="w-10 h-10 flex items-center justify-center border-[3px] border-[#000000] bg-[#efeeea] hover:bg-[#e9e8e4] transition-colors shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
          title="Notifications"
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <button
          onClick={handleSaveDraft}
          className="hidden sm:block font-bold text-xs uppercase tracking-wider py-2.5 px-4 border-[3px] border-[#000000] bg-[#efeeea] hover:bg-[#e9e8e4] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer"
        >
          Save Draft
        </button>

        <button
          onClick={handlePublishClick}
          className="font-bold text-xs uppercase tracking-wider py-2.5 px-4 sm:px-6 border-[3px] border-[#000000] bg-[#74b9ff] text-[#004979] shadow-[3px_3px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Publish</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>

        <img
          src={currentPost.authorAvatar}
          alt="Creator Avatar"
          className="w-10 h-10 rounded-full border-[3px] border-[#000000] object-cover ml-1 bg-[#ffe173]"
        />
      </div>
    </header>
  );
};
