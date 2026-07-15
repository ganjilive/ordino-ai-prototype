"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";

import { agentScript } from "@/lib/agent/agent-script";
import type { AgentDiff, AgentStep } from "@/lib/agent/types";

function DiffBlock({ diff }: { diff: AgentDiff }) {
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
          <span className="whitespace-pre-wrap">{diff.after.trim()}</span>
        </div>
      </div>
    </div>
  );
}

function OrdinoBox({ call, result }: { call: AgentStep; result: AgentStep | null }) {
  return (
    <div className="ordino-gradient-ring my-2 rounded-lg p-[1.5px]">
      <div className="rounded-[7px] bg-[#1e1e1e] p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
          <span className="ordino-gradient-text">Ordino</span>
          <span className="normal-case tracking-normal text-[#6b6b6b]">{call.text}</span>
        </div>
        {result ? (
          <div className="mt-1 text-[#cccccc]">{result.text}</div>
        ) : (
          <div className="mt-1 flex items-center gap-2 text-[#9da5b4]">
            <span className="ordino-gradient-bg h-1.5 w-1.5 animate-pulse rounded-full" />
            Ordino is checking…
          </div>
        )}
      </div>
    </div>
  );
}

function AgentStepView({ step }: { step: AgentStep }) {
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

function renderRevealed(steps: AgentStep[]) {
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (step.kind === "ordino-call") {
      const next = steps[i + 1];
      const result = next?.kind === "ordino-result" ? next : null;
      nodes.push(<OrdinoBox key={step.id} call={step} result={result} />);
      if (result) i += 1;
      continue;
    }
    nodes.push(<AgentStepView key={step.id} step={step} />);
  }
  return nodes;
}

export function CodingAgentView() {
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
      if (cancelled || index >= agentScript.length) return;
      const step = agentScript[index];
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
    setSubmittedInput(
      inputValue.trim() || "Add tests for the promo-code + tax path in calculateTotal",
    );
    setInputValue("");
    setHasStarted(true);
  }

  const finished = hasStarted && revealedCount >= agentScript.length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Ordino
        </Link>
        <span className="text-muted-foreground">/</span>
        <Bot className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Coding Agent</span>
        <span className="ml-auto text-xs text-muted-foreground">booking-website</span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#1e1e1e] p-3 font-mono text-[13px] leading-[20px] text-[#cccccc]"
      >
        {hasStarted && submittedInput && (
          <div className="flex gap-2">
            <span className="text-[#4ec9b0]">{">"}</span>
            <span>{submittedInput}</span>
          </div>
        )}

        {renderRevealed(agentScript.slice(0, revealedCount))}

        {hasStarted && !finished && (
          <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ec9b0]" />
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
              placeholder="Add tests for the promo-code + tax path in calculateTotal"
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
    </div>
  );
}
