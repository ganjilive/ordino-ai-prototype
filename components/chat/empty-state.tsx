"use client";

import { LogoMark } from "@/components/shell/logo-mark";

const suggestedPrompts = [
  "Plan test automation for the checkout flow",
  "What's our current test coverage?",
  "Review code quality for this repo",
  "Help me plan a new feature: saved payment methods",
  "Give me our quality metrics for the last 30 days",
];

export function EmptyState({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <LogoMark />
      <div>
        <h2 className="text-lg font-semibold">How can I help with this project?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ordino routes your request to the right agent automatically.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelectPrompt(prompt)}
            className="rounded-lg border border-border bg-card px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-accent"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
