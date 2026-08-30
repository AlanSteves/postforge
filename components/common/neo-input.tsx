"use client";

import React from "react";

export interface NeoInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const NeoInput: React.FC<NeoInputProps> = ({
  label,
  error,
  icon,
  className = "",
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="font-bold text-xs uppercase tracking-wider text-[#1b1c1a]">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 text-[#414750] pointer-events-none text-xl">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-[#ffffff] text-[#1b1c1a] border-[3px] border-[#000000] p-3 font-medium placeholder:text-[#717881] focus:outline-none focus:bg-[#FAF9F5] shadow-[3px_3px_0px_0px_#000000] transition-colors ${
            icon ? "pl-10" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs font-bold text-[#ba1a1a]">{error}</span>}
    </div>
  );
};
