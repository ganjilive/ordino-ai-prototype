"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, SquareTerminal, TriangleAlert } from "lucide-react";

import { answerQuestion, bannerSteps, SUGGESTED_QUESTIONS } from "@/lib/terminal/companion-script";
import type { TerminalCompanionStep } from "@/lib/terminal/types";

function StepLine({ step }: { step: TerminalCompanionStep }) {
  switch (step.kind) {
    case "tool":
      return (
        <div className="flex gap-2 pt-2">
          <span className="text-[#e5c07b]">●</span>
          <span className="text-white">{step.text}</span>
        </div>
      );
    case "tool-result":
      return (
        <div className="flex gap-2 pl-6 text-[#6b6b6b]">
          <span>⎿</span>
          <span>{step.text}</span>
        </div>
      );
    case "finding":
      return (
        <div className="my-2 rounded border border-[#e5c07b]/40 bg-[#e5c07b]/[0.06] p-2">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#e5c07b]">
            <TriangleAlert className="h-3.5 w-3.5" />
            Proactive finding — cross-repo
          </div>
          <div className="mt-1 text-[#e6d3a3]">{step.text}</div>
        </div>
      );
    case "prompt":
      return (
        <div className="flex gap-2 pt-3">
          <span className="text-[#4ec9b0]">{">"}</span>
          <span className="text-white">{step.text}</span>
        </div>
      );
    case "answer":
      return <div className="pt-2 text-[#cccccc]">{step.text}</div>;
    default:
      return null;
  }
}

export function TerminalCompanionView() {
  const [started, setStarted] = useState(false);
  const [revealedSteps, setRevealedSteps] = useState<TerminalCompanionStep[]>([]);
  const [pendingSteps, setPendingSteps] = useState<TerminalCompanionStep[]>([]);
  const [shellInput, setShellInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const promptIdRef = useRef(0);

  const isRevealing = pendingSteps.length > 0;
  const isReady = started && !isRevealing;

  useEffect(() => {
    if (pendingSteps.length === 0) return;
    const [next, ...rest] = pendingSteps;
    const timer = window.setTimeout(() => {
      setRevealedSteps((previous) => [...previous, next]);
      setPendingSteps(rest);
    }, next.delayMs);
    return () => {
      window.clearTimeout(timer);
    };
  }, [pendingSteps]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [revealedSteps, isReady]);

  function handleLaunch(event: React.FormEvent) {
    event.preventDefault();
    if (started) return;
    setStarted(true);
    setPendingSteps(bannerSteps);
  }

  function handleAsk(question: string) {
    const trimmed = question.trim();
    if (!trimmed || !isReady) return;
    promptIdRef.current += 1;
    const steps: TerminalCompanionStep[] = [
      { id: `prompt-${promptIdRef.current}`, kind: "prompt", delayMs: 0, text: trimmed },
      ...answerQuestion(trimmed),
    ];
    setQuestionInput("");
    setPendingSteps(steps);
  }

  function handleAskSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleAsk(questionInput);
  }

  const bannerEndIndex = revealedSteps.findIndex(
    (step) => step.kind !== "banner-title" && step.kind !== "banner-line",
  );
  const bannerBoxSteps = bannerEndIndex === -1 ? revealedSteps : revealedSteps.slice(0, bannerEndIndex);
  const restSteps = bannerEndIndex === -1 ? [] : revealedSteps.slice(bannerEndIndex);

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
        <SquareTerminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Ordino Terminal Companion</span>
        <span className="ml-auto text-xs text-muted-foreground">booking-website</span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#1e1e1e] p-3 font-mono text-[13px] leading-[20px] text-[#cccccc]"
      >
        {!started && (
          <form onSubmit={handleLaunch} className="flex items-center gap-2">
            <span className="text-[#6b6b6b]">booking-website on main $</span>
            <input
              autoFocus
              value={shellInput}
              onChange={(event) => setShellInput(event.target.value)}
              className="flex-1 bg-transparent text-white outline-none placeholder:text-[#5a5a5a]"
              placeholder="ordino"
            />
          </form>
        )}

        {started && shellInput.trim() && (
          <div className="flex gap-2 text-[#6b6b6b]">
            <span>booking-website on main $</span>
            <span>{shellInput}</span>
          </div>
        )}

        {bannerBoxSteps.length > 0 && (
          <div className="my-2 rounded-lg border border-white/15 bg-white/[0.02] p-3">
            {bannerBoxSteps.map((step) =>
              step.kind === "banner-title" ? (
                <div key={step.id} className="font-semibold text-white">
                  {step.text}
                </div>
              ) : (
                <div key={step.id} className="mt-1 text-[#9da5b4]">
                  {step.text}
                </div>
              ),
            )}
          </div>
        )}

        {restSteps.map((step, index) => (
          <StepLine key={`${step.id}-${index}`} step={step} />
        ))}

        {isReady && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleAsk(question)}
                  className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-[#4ec9b0] hover:bg-white/10"
                >
                  {question}
                </button>
              ))}
            </div>
            <form
              onSubmit={handleAskSubmit}
              className="rounded-lg border border-white/15 bg-white/[0.02] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="text-[#4ec9b0]">{">"}</span>
                <input
                  autoFocus
                  value={questionInput}
                  onChange={(event) => setQuestionInput(event.target.value)}
                  className="flex-1 bg-transparent text-white outline-none placeholder:text-[#5a5a5a]"
                  placeholder={`Try "what's our test coverage?"`}
                />
              </div>
            </form>
          </div>
        )}

        {started && isRevealing && (
          <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ec9b0]" />
            Ordino is thinking…
          </div>
        )}
      </div>
    </div>
  );
}
