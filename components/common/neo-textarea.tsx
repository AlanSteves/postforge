"use client";

import React from "react";

export interface NeoTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const NeoTextarea: React.FC<NeoTextareaProps> = ({
  label,
  error,
  className = "",
  id,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={textareaId} className="font-bold text-xs uppercase tracking-wider text-[#1b1c1a]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full bg-[#ffffff] text-[#1b1c1a] border-[3px] border-[#000000] p-3 font-medium placeholder:text-[#717881] focus:outline-none focus:bg-[#FAF9F5] shadow-[3px_3px_0px_0px_#000000] transition-colors resize-none ${className}`}
        {...props}
      />
      {error && <span className="text-xs font-bold text-[#ba1a1a]">{error}</span>}
    </div>
  );
};
