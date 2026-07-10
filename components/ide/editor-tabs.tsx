"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { findFile } from "@/lib/ide/file-tree";
import { useIde } from "@/components/ide/ide-context";

export function EditorTabs() {
  const { openTabs, activeTabPath, setActiveTabPath, closeTab } = useIde();

  return (
    <div className="flex h-9 shrink-0 items-stretch overflow-x-auto bg-[#252526]">
      {openTabs.map((path) => {
        const file = findFile(path);
        const active = path === activeTabPath;
        return (
          <div
            key={path}
            onClick={() => setActiveTabPath(path)}
            className={cn(
              "group flex min-w-[120px] cursor-pointer items-center gap-2 border-r border-black/20 px-3 text-[13px]",
              active
                ? "bg-[#1e1e1e] text-white"
                : "bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2a2a]",
            )}
          >
            <span className="truncate">{file?.name ?? path}</span>
            <button
              onClick={(event) => {
                event.stopPropagation();
                closeTab(path);
              }}
              aria-label={`Close ${file?.name ?? path}`}
              className="ml-auto rounded p-0.5 text-[#969696] opacity-0 hover:bg-white/10 hover:text-white group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
