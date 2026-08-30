"use client";

import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col justify-center items-center p-4 md:p-8">
      {/* Brand Badge */}
      <Link href="/chat" className="mb-6 flex flex-col items-center gap-1 group">
        <h1 className="text-4xl font-black text-[#1b1c1a] tracking-tight group-hover:text-[#0062a0] transition-colors">
          PostForge AI
        </h1>
        <span className="font-bold text-xs uppercase tracking-widest text-[#414750] bg-[#ffe173] px-3 py-1 border-[2.5px] border-[#000000] shadow-[3px_3px_0px_0px_#000]">
          Neubrutalist Creator Pro
        </span>
      </Link>

      {/* Main Form Container */}
      <div className="max-w-[480px] w-full bg-[#ffffff] border-[4px] border-[#000000] shadow-[8px_8px_0px_0px_#000000] p-6 sm:p-10">
        <div className="border-b-[3px] border-[#000000] pb-4 mb-6">
          <h2 className="text-2xl font-black uppercase text-[#1b1c1a]">{title}</h2>
          <p className="text-sm font-semibold text-[#414750] mt-1">{subtitle}</p>
        </div>
        {children}
      </div>

      {/* Footer copyright */}
      <p className="mt-8 text-xs font-bold text-[#717881]">
        © 2026 PostForge AI. Built with Neubrutalism Design System.
      </p>
    </div>
  );
};
