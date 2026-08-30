"use client";

import React from "react";

export interface NeoBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  selected?: boolean;
  variant?: "primary" | "secondary" | "accent" | "dark";
  children: React.ReactNode;
}

export const NeoBadge: React.FC<NeoBadgeProps> = ({
  selected = false,
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  const baseClasses = "px-3 py-1.5 font-bold text-xs border-[2.5px] border-[#000000] inline-flex items-center gap-1.5 transition-all cursor-pointer select-none";

  const activeStyles = {
    primary: "bg-[#74B9FF] text-[#004979] shadow-[3px_3px_0px_0px_#000000]",
    secondary: "bg-[#ffe173] text-[#221b00] shadow-[3px_3px_0px_0px_#000000]",
    accent: "bg-[#ff94b1] text-[#7e2443] shadow-[3px_3px_0px_0px_#000000]",
    dark: "bg-[#1b1c1a] text-[#ffffff] shadow-[3px_3px_0px_0px_#74B9FF]",
  };

  const inactiveStyle = "bg-[#ffffff] text-[#414750] hover:bg-[#efeeea] border-[#000000] shadow-[2px_2px_0px_0px_#000000]";

  const appliedStyle = selected ? activeStyles[variant] : inactiveStyle;

  return (
    <span className={`${baseClasses} ${appliedStyle} ${className}`} {...props}>
      {children}
    </span>
  );
};
