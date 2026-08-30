"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { ChatWindow } from "./chat-window";
import { PreferencesPanel } from "@/components/preferences/preferences-panel";

export const ChatLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobilePreferencesOpen, setMobilePreferencesOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF9F5]">
      {/* 1. Desktop Left Sidebar (Fixed 64 width / 256px) */}
      <div className="hidden md:block h-full w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-72 h-full">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Center + Right Section */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* App Header */}
        <AppHeader
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
          onToggleMobilePreferences={() => setMobilePreferencesOpen(true)}
        />

        {/* Workspace Body: Center Chat + Right Preferences */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center Chat Window */}
          <div className="flex-1 flex flex-col min-w-0 h-full">
            <ChatWindow />
          </div>

          {/* 3. Desktop Right Preferences Column (Fixed width: 340px) */}
          <div className="hidden lg:block w-[340px] shrink-0 h-full p-4 overflow-y-auto border-l-[3px] border-[#000000] bg-[#FAF9F5]">
            <PreferencesPanel />
          </div>
        </div>
      </div>

      {/* Mobile Preferences Drawer / Bottom Sheet */}
      {mobilePreferencesOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div
            className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs"
            onClick={() => setMobilePreferencesOpen(false)}
          />
          <div className="relative z-10 w-full sm:w-[380px] h-full overflow-y-auto bg-[#FAF9F5] p-4 border-l-[4px] border-[#000000]">
            <PreferencesPanel onCloseMobile={() => setMobilePreferencesOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};
