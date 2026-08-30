"use client";

import React from "react";

export interface NeoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  borderSize?: "2px" | "3px" | "4px";
  shadowSize?: "sm" | "md" | "lg" | "none";
  bgColor?: string;
  children: React.ReactNode;
}

export const NeoCard: React.FC<NeoCardProps> = ({
  borderSize = "3px",
  shadowSize = "md",
  bgColor = "bg-[#FAF9F5]",
  className = "",
  children,
  ...props
}) => {
  const borderClasses = {
    "2px": "border-[2px] border-[#000000]",
    "3px": "border-[3px] border-[#000000]",
    "4px": "border-[4px] border-[#000000]",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-[3px_3px_0px_0px_#000000]",
    md: "shadow-[5px_5px_0px_0px_#000000]",
    lg: "shadow-[8px_8px_0px_0px_#000000]",
  };

  return (
    <div
      className={`${borderClasses[borderSize]} ${shadowClasses[shadowSize]} ${bgColor} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
