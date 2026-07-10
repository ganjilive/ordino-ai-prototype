"use client";

import { Check, GitBranch } from "lucide-react";

import { findFile } from "@/lib/ide/file-tree";
import { useIde } from "@/components/ide/ide-context";

export function StatusBar() {
  const { activeTabPath } = useIde();
  const activeFile = activeTabPath ? findFile(activeTabPath) : undefined;

  return (
    <div className="flex h-6 shrink-0 items-center justify-between bg-[#007acc] px-3 text-[12px] text-white">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3.5 w-3.5" />
          main
        </span>
        <span className="flex items-center gap-1">
          <Check className="h-3.5 w-3.5" />
          0
        </span>
      </div>
      <div className="flex items-center gap-3">
        {activeFile && (
          <>
            <span>Ln 20, Col 3</span>
            <span>UTF-8</span>
            <span className="capitalize">{activeFile.language}</span>
          </>
        )}
      </div>
    </div>
  );
}
