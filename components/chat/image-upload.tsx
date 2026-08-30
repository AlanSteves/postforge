"use client";

import React, { useRef } from "react";
import { usePostContext } from "@/context/post-context";

export const ImageUpload: React.FC = () => {
  const { attachedImage, setAttachedImage } = usePostContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAttachedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  if (attachedImage) {
    return (
      <div className="relative border-[3px] border-[#000000] bg-[#ffffff] p-2 shadow-[3px_3px_0px_0px_#000000] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={attachedImage}
            alt="Attached Preview"
            className="w-12 h-12 object-cover border-[2px] border-[#000000]"
          />
          <div className="flex flex-col">
            <span className="font-bold text-xs text-[#1b1c1a] truncate">Attached Image</span>
            <span className="text-[10px] font-semibold text-[#55E6C1] bg-[#000] px-1.5 py-0.5 w-fit">
              Ready for post
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 border-[2px] border-[#000] bg-[#FAF9F5] hover:bg-[#ffe173] text-xs font-bold"
            title="Replace Image"
          >
            Replace
          </button>
          <button
            type="button"
            onClick={() => setAttachedImage(null)}
            className="p-1.5 border-[2px] border-[#000] bg-[#ff94b1] hover:bg-[#ba1a1a] hover:text-[#fff] text-xs font-bold"
            title="Remove Image"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => fileInputRef.current?.click()}
      className="border-[3px] border-dashed border-[#000000] bg-[#ffffff] hover:bg-[#FAF9F5] p-3 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-1 shadow-[3px_3px_0px_0px_#000000]"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-[#1b1c1a]">
        <span className="material-symbols-outlined text-base text-[#0062a0]">add_photo_alternate</span>
        + OPTIONAL IMAGE (PNG / JPG / WEBP)
      </div>
      <span className="text-[11px] font-medium text-[#717881]">
        Drag & drop or click to import media
      </span>
    </div>
  );
};
