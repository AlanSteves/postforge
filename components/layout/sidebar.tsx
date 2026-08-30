"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePostContext } from "@/context/post-context";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { recentSearches, selectSearch, clearMessages, user, signout } = usePostContext();

  const handleNewDraft = () => {
    clearMessages();
    router.push("/chat");
    if (onCloseMobile) onCloseMobile();
  };

  const navItems = [
    { label: "Forge (Chat)", href: "/chat", icon: "auto_awesome" },
    { label: "Post Preview", href: "/post-preview", icon: "visibility" },
    { label: "Library", href: "#", icon: "inventory_2" },
    { label: "Analytics", href: "#", icon: "equalizer" },
    { label: "Settings", href: "#", icon: "settings" },
  ];

  return (
    <aside className="h-full w-64 border-r-[3px] border-[#000000] shadow-[5px_5px_0px_0px_#000000] bg-[#FAF9F5] flex flex-col z-50">
      {/* Brand Header */}
      <div className="p-6 border-b-[3px] border-[#000000] flex flex-col gap-1 bg-[#FAF9F5]">
        <Link href="/chat" onClick={onCloseMobile} className="group">
          <h1 className="text-2xl font-black tracking-tight text-[#1b1c1a] group-hover:text-[#0062a0] transition-colors">
            PostForge AI
          </h1>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="font-bold text-xs uppercase tracking-widest text-[#414750] bg-[#ffe173] px-2 py-0.5 border-[2px] border-[#000000] shadow-[2px_2px_0px_0px_#000]">
            Creator Pro
          </span>
          {user && (
            <span className="text-[11px] font-bold text-[#717881] truncate max-w-[100px]">
              {user.name}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onCloseMobile}
              className={`w-full font-bold flex items-center gap-3 px-4 py-3 border-[3px] rounded-none transition-all ${
                isActive
                  ? "bg-[#74b9ff]/20 border-[#0062a0] text-[#0062a0] shadow-[3px_3px_0px_0px_#0062a0]"
                  : "border-transparent text-[#414750] hover:bg-[#efeeea] hover:border-[#000000] hover:translate-x-1 hover:translate-y-1"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-bold text-xs uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}

        {/* Recent Searches Section in Sidebar */}
        <div className="mt-6 pt-4 border-t-[3px] border-[#000000]">
          <div className="flex items-center gap-2 px-2 mb-3">
            <span className="material-symbols-outlined text-sm text-[#717881]">history</span>
            <span className="font-bold text-xs uppercase tracking-wider text-[#717881]">
              Recent Searches
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            {recentSearches.slice(0, 5).map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  selectSearch(topic);
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full text-left text-xs font-semibold text-[#1b1c1a] px-3 py-2 bg-[#ffffff] border-[2px] border-[#000000] hover:bg-[#ffe173] hover:shadow-[2px_2px_0px_0px_#000] truncate transition-all"
              >
                # {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* New Draft & Sign Out Actions */}
      <div className="p-4 border-t-[3px] border-[#000000] bg-[#FAF9F5] flex flex-col gap-2">
        <button
          onClick={handleNewDraft}
          className="w-full bg-[#74b9ff] text-[#004979] font-bold text-xs uppercase tracking-wider py-3 px-4 border-[3px] border-[#000000] shadow-[5px_5px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Draft
        </button>

        <button
          onClick={signout}
          className="w-full bg-[#efeeea] text-[#414750] font-bold text-xs uppercase tracking-wider py-2 px-4 border-[2px] border-[#000000] hover:bg-[#ff94b1] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};
