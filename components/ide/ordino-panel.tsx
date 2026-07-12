"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, TriangleAlert, Zap } from "lucide-react";

import { allFilePaths } from "@/lib/ide/file-tree";
import { proactiveDependencyWarningSteps } from "@/lib/ide/impact-analysis-fixture";
import { routeIdeMessage } from "@/lib/ide/ordino-script";
import type { IdeChatMessage, IdeScriptedStep } from "@/lib/ide/types";
import { useIde } from "@/components/ide/ide-context";
import { RecommendedFixCard } from "@/components/ide/recommended-fix-card";
import { TestReviewCard } from "@/components/ide/test-review-card";

const INITIAL_MESSAGE: IdeChatMessage = {
  id: "msg-intro",
  role: "assistant",
  content:
    "Hi, I'm Ordino. I can see the Booking Website project is open. Ask me about a bug or code you'd like me to look into — I'll investigate and hand you a prompt for your coding agent.",
};

const DEPENDENT_AREAS_PROMPT =
  "I want to identify the dependent areas that should be tested based on the change I did.";

const SUGGESTED_PROMPTS = [
  "I have finished developing the feature. Please update tests and execute them locally.",
  DEPENDENT_AREAS_PROMPT,
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const FILE_PATH_PATTERN = new RegExp(
  `(${[...allFilePaths].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|")})`,
);

function MessageContent({ content }: { content: string }) {
  const { openFile } = useIde();
  const parts = content.split(FILE_PATH_PATTERN);

  return (
    <>
      {parts.map((part, index) =>
        allFilePaths.includes(part) ? (
          <button
            key={index}
            onClick={() => openFile(part)}
            className="mx-0.5 rounded bg-white/10 px-1 py-0.5 font-mono text-[12px] text-[#4ec9b0] hover:bg-white/20"
          >
            {part}
          </button>
        ) : (
          <Fragment key={index}>{part}</Fragment>
        ),
      )}
    </>
  );
}

export function OrdinoPanel() {
  const [messages, setMessages] = useState<IdeChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [proactiveTriggered, setProactiveTriggered] = useState(false);
  const [usedOfferIds, setUsedOfferIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, isThinking]);

  function nextId(suffix: string): string {
    nextIdRef.current += 1;
    return `msg-${nextIdRef.current}-${suffix}`;
  }

  function playSteps(steps: IdeScriptedStep[]) {
    setIsThinking(true);
    let index = 0;

    function scheduleNext() {
      const step = steps[index];
      window.setTimeout(() => {
        index += 1;
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(`reply-${index}`),
            role: "assistant",
            content: step.content,
            fix: step.fix,
            review: step.review,
            proactive: step.proactive,
            offer: step.offer,
          },
        ]);
        if (index < steps.length) {
          scheduleNext();
        } else {
          setIsThinking(false);
        }
      }, step.delayMs);
    }

    scheduleNext();
  }

  function sendMessage(trimmed: string) {
    if (!trimmed || isThinking) return;

    const userMessage: IdeChatMessage = {
      id: nextId("user"),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const { steps } = routeIdeMessage(trimmed);
    playSteps(steps);
  }

  function triggerProactiveEvent() {
    if (isThinking || proactiveTriggered) return;

    setProactiveTriggered(true);
    const eventMessage: IdeChatMessage = {
      id: nextId("event"),
      role: "event",
      content: "booking-website — pricing change pushed to main",
    };
    setMessages((prev) => [...prev, eventMessage]);
    playSteps(proactiveDependencyWarningSteps);
  }

  function handleOfferSelect(message: IdeChatMessage) {
    if (!message.offer || isThinking || usedOfferIds.has(message.id)) return;
    setUsedOfferIds((prev) => new Set(prev).add(message.id));
    playSteps(message.offer.followup);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    sendMessage(input.trim());
  }

  return (
    <div className="flex h-full w-96 shrink-0 flex-col border-l border-black/30 bg-[#252526] text-[#cccccc]">
      <div className="flex h-9 shrink-0 items-center gap-2 border-b border-black/20 px-3 text-[12px] font-semibold uppercase tracking-wide text-[#bbbbbb]">
        <span className="ordino-gradient-bg flex h-5 w-5 items-center justify-center rounded">
          <Sparkles className="h-3 w-3 text-white" />
        </span>
        Ordino
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
        {messages.map((message) => {
          if (message.role === "event") {
            return (
              <div key={message.id} className="flex justify-center py-1">
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-[#969696]">
                  <Zap className="h-3 w-3 text-[#e5c07b]" />
                  {message.content}
                </div>
              </div>
            );
          }

          const offerUsed = usedOfferIds.has(message.id);

          return (
            <div
              key={message.id}
              className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  message.role === "user"
                    ? "ordino-gradient-bg max-w-[85%] rounded-lg px-3 py-2 text-[13px] text-white"
                    : message.proactive
                      ? "max-w-[92%] space-y-2 rounded-md border-l-2 border-[#e5c07b] bg-white/[0.03] py-1.5 pl-2.5 text-[13px] leading-relaxed"
                      : "max-w-[92%] space-y-2 text-[13px] leading-relaxed"
                }
              >
                {message.proactive && (
                  <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-[#e5c07b]">
                    <TriangleAlert className="h-3 w-3" />
                    Ordino flagged this
                  </div>
                )}
                <div className={message.role === "assistant" ? "whitespace-pre-wrap" : undefined}>
                  <MessageContent content={message.content} />
                </div>
                {message.fix && <RecommendedFixCard fix={message.fix} />}
                {message.review && <TestReviewCard review={message.review} />}
                {message.offer && !offerUsed && (
                  <button
                    onClick={() => handleOfferSelect(message)}
                    disabled={isThinking}
                    className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[12px] text-[#cccccc] hover:bg-white/10 disabled:opacity-40"
                  >
                    {message.offer.label}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {isThinking && (
          <div className="flex justify-start text-[13px] text-[#969696]">Ordino is thinking…</div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-black/20 px-2 pt-2">
        {!proactiveTriggered && (
          <button
            type="button"
            disabled={isThinking}
            onClick={triggerProactiveEvent}
            className="flex items-center gap-1.5 rounded-md border border-dashed border-white/20 bg-white/[0.03] px-2.5 py-1.5 text-left text-[12px] leading-snug text-[#cccccc] hover:bg-white/10 disabled:opacity-40"
          >
            <span className="rounded bg-white/10 px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#969696]">
              Demo
            </span>
            Simulate: pricing change lands in booking-website
          </button>
        )}
        {SUGGESTED_PROMPTS.filter((prompt) => !proactiveTriggered || prompt !== DEPENDENT_AREAS_PROMPT).map(
          (prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={isThinking}
              onClick={() => sendMessage(prompt)}
              className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-left text-[12px] leading-snug text-[#cccccc] hover:bg-white/10 disabled:opacity-40"
            >
              {prompt}
            </button>
          ),
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-2">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
          placeholder="Ask Ordino about this codebase…"
          rows={2}
          className="w-full resize-none rounded-md border border-white/10 bg-[#1e1e1e] px-2.5 py-2 text-[13px] text-[#cccccc] outline-none placeholder:text-[#6b6b6b] focus-visible:border-white/30"
        />
        <div className="flex justify-end pt-1.5">
          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="ordino-gradient-bg flex h-7 w-7 items-center justify-center rounded-full text-white disabled:opacity-40"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
