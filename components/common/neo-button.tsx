"use client";

import React from "react";

export interface NeoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "danger" | "dark" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const NeoButton: React.FC<NeoButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const baseStyles = "font-bold tracking-tight border-[3px] border-[#000000] inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-x-[3px] active:translate-y-[3px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px]";

  const variantStyles = {
    primary: "bg-[#74B9FF] text-[#004979] hover:bg-[#62a7ed] shadow-[4px_4px_0px_0px_#000000]",
    secondary: "bg-[#FAF9F5] text-[#1b1c1a] hover:bg-[#efeeea] shadow-[4px_4px_0px_0px_#000000]",
    accent: "bg-[#ffe173] text-[#221b00] hover:bg-[#ebd05d] shadow-[4px_4px_0px_0px_#000000]",
    danger: "bg-[#ff94b1] text-[#7e2443] hover:bg-[#f0819e] shadow-[4px_4px_0px_0px_#000000]",
    dark: "bg-[#1b1c1a] text-[#ffffff] hover:bg-[#000000] shadow-[4px_4px_0px_0px_#74B9FF]",
    outline: "bg-transparent text-[#1b1c1a] hover:bg-[#efeeea] shadow-[4px_4px_0px_0px_#000000]",
  };

  const sizeStyles = {
    sm: "py-1.5 px-3 text-xs uppercase font-bold",
    md: "py-2.5 px-5 text-sm uppercase font-bold",
    lg: "py-3.5 px-6 text-base uppercase font-bold",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
