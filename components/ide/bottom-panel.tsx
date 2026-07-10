"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { TerminalPanel } from "@/components/ide/terminal-panel";

const TABS = ["Problems", "Output", "Debug Console", "Terminal"] as const;

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("Terminal");

  return (
    <div className="flex h-64 shrink-0 flex-col border-t border-black/30 bg-[#1e1e1e]">
      <div className="flex h-8 shrink-0 items-center gap-4 border-b border-black/20 px-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "border-b-2 border-transparent px-1 pt-1 text-[12px] uppercase tracking-wide text-[#969696] hover:text-white",
              activeTab === tab && "border-white text-white",
            )}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {activeTab === "Terminal" ? (
          <TerminalPanel />
        ) : (
          <div className="flex h-full items-center justify-center text-[13px] text-[#6b6b6b]">
            No {activeTab.toLowerCase()} to show.
          </div>
        )}
      </div>
    </div>
  );
}
