"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function TitleBar() {
  const router = useRouter();

  return (
    <div className="flex h-9 shrink-0 items-center bg-[#3c3c3c] px-3 text-[13px] text-[#cccccc]">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[#cccccc]/80 hover:bg-white/10 hover:text-[#cccccc]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Exit IDE
        </button>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
        </div>
      </div>
      <div className="flex-1 truncate text-center text-[#cccccc]/70">
        booking-website — Visual Studio Code
      </div>
      <div className="flex-1" />
    </div>
  );
}
