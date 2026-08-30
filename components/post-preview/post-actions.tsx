"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NeoButton } from "@/components/common/neo-button";
import { PublishModal } from "./publish-modal";

export const PostActions: React.FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = () => {
    router.push("/chat");
  };

  const handlePublishConfirm = () => {
    setIsModalOpen(false);
    router.push("/chat");
  };

  return (
    <>
      <div className="max-w-[700px] w-full flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
        <button
          onClick={handleEditClick}
          className="flex-1 py-4 px-6 border-[4px] border-[#000000] bg-[#FAF9F5] text-[#1b1c1a] font-bold text-xs uppercase tracking-wider shadow-[5px_5px_0px_0px_#000000] hover:bg-[#efeeea] transition-all active:translate-x-[5px] active:translate-y-[5px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] flex items-center justify-center gap-3 cursor-pointer"
        >
          <span className="material-symbols-outlined font-bold">arrow_back</span>
          EDIT POST
        </button>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex-1 py-4 px-6 border-[4px] border-[#000000] bg-[#74b9ff] text-[#004979] font-bold text-xs uppercase tracking-wider shadow-[5px_5px_0px_0px_#000000] hover:bg-[#62a7ed] transition-all active:translate-x-[5px] active:translate-y-[5px] active:shadow-none hover:-translate-x-[1px] hover:-translate-y-[1px] flex items-center justify-center gap-3 text-base cursor-pointer"
        >
          POST TO LINKEDIN
          <span className="material-symbols-outlined font-bold">arrow_forward</span>
        </button>
      </div>

      <PublishModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePublishConfirm}
      />
    </>
  );
};
