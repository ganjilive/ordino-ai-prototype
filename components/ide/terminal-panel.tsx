"use client";

import { useEffect, useRef, useState } from "react";

import { terminalScript } from "@/lib/ide/terminal-script";
import type { TerminalDiff, TerminalStep } from "@/lib/ide/types";

function DiffBlock({ diff }: { diff: TerminalDiff }) {
  return (
    <div className="my-2 ml-6 rounded border border-white/10 bg-black/30">
      <div className="border-b border-white/10 px-2 py-1 text-[12px] text-[#9da5b4]">
        {diff.filePath}
      </div>
      <div className="px-2 py-1">
        <div className="flex gap-2 text-[#f47067]">
          <span>-</span>
          <span>{diff.before.trim()}</span>
        </div>
        <div className="flex gap-2 text-[#7ee787]">
          <span>+</span>
          <span>{diff.after.trim()}</span>
        </div>
      </div>
    </div>
  );
}

function TerminalStepView({ step }: { step: TerminalStep }) {
  switch (step.kind) {
    case "tool":
      return (
        <div className="flex gap-2 pt-2">
          <span className="text-[#e5c07b]">●</span>
          <span className="text-white">{step.text}</span>
        </div>
      );
    case "result":
      return (
        <div className="flex gap-2 pl-6 text-[#6b6b6b]">
          <span>⎿</span>
          <span>{step.text}</span>
        </div>
      );
    case "text":
      return <div className="pt-2 text-[#cccccc]">{step.text}</div>;
    case "output":
      return (
        <div className="ml-6 mt-1 whitespace-pre-wrap text-[#9da5b4]">{step.text}</div>
      );
    case "success":
      return (
        <div className="flex gap-2 pt-2 font-medium text-[#89d185]">
          <span>✔</span>
          <span>{step.text}</span>
        </div>
      );
    case "diff":
      return step.diff ? <DiffBlock diff={step.diff} /> : null;
    default:
      return null;
  }
}

export function TerminalPanel() {
  const [inputValue, setInputValue] = useState("");
  const [submittedInput, setSubmittedInput] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasStarted) return;
    let cancelled = false;
    let index = 0;

    function scheduleNext() {
      if (cancelled || index >= terminalScript.length) return;
      const step = terminalScript[index];
      window.setTimeout(() => {
        if (cancelled) return;
        index += 1;
        setRevealedCount(index);
        scheduleNext();
      }, step.delayMs);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, [hasStarted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [revealedCount, hasStarted]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (hasStarted) return;
    setSubmittedInput(inputValue.trim() || "npx claude");
    setInputValue("");
    setHasStarted(true);
  }

  const finished = hasStarted && revealedCount >= terminalScript.length;

  return (
    <div
      ref={scrollRef}
      className="h-full overflow-y-auto bg-[#1e1e1e] p-3 font-mono text-[13px] leading-[20px] text-[#cccccc]"
    >
      {hasStarted && submittedInput && (
        <div className="flex gap-2">
          <span className="text-[#4ec9b0]">{">"}</span>
          <span>{submittedInput}</span>
        </div>
      )}

      {terminalScript.slice(0, revealedCount).map((step) => (
        <TerminalStepView key={step.id} step={step} />
      ))}

      {hasStarted && !finished && (
        <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
          <span className="h-2 w-2 rounded-full bg-[#4ec9b0] animate-pulse" />
          Claude Code is running…
        </div>
      )}

      {!hasStarted && (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="text-[#4ec9b0]">{">"}</span>
          <input
            autoFocus
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            className="flex-1 bg-transparent outline-none placeholder:text-[#5a5a5a]"
            placeholder="Paste the prompt from Ordino and press Enter"
          />
        </form>
      )}

      {finished && (
        <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
          <span>{">"}</span>
          <span className="animate-pulse">▍</span>
        </div>
      )}
    </div>
  );
}
