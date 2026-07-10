"use client";

import { getFileLines } from "@/lib/ide/file-contents";
import type { CodeTokenKind } from "@/lib/ide/types";
import { useIde } from "@/components/ide/ide-context";

const TOKEN_COLORS: Record<CodeTokenKind, string> = {
  plain: "text-[#d4d4d4]",
  keyword: "text-[#569cd6]",
  string: "text-[#ce9178]",
  comment: "text-[#6a9955]",
  type: "text-[#4ec9b0]",
  function: "text-[#dcdcaa]",
  number: "text-[#b5cea8]",
  punct: "text-[#d4d4d4]",
};

export function EditorPane() {
  const { activeTabPath } = useIde();

  if (!activeTabPath) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#1e1e1e] text-sm text-[#6b6b6b]">
        No file open
      </div>
    );
  }

  const lines = getFileLines(activeTabPath);

  return (
    <div className="flex-1 overflow-auto bg-[#1e1e1e] font-mono text-[13px] leading-[20px]">
      {lines.map((line, index) => (
        <div key={index} className="flex px-2">
          <span className="w-10 shrink-0 select-none pr-3 text-right text-[#6e7681]">
            {index + 1}
          </span>
          <span className="whitespace-pre">
            {line.length === 0 ? (
              " "
            ) : (
              line.map((token, tokenIndex) => (
                <span key={tokenIndex} className={TOKEN_COLORS[token.kind ?? "plain"]}>
                  {token.text}
                </span>
              ))
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
