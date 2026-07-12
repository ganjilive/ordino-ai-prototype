"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function FixPromptCard({ prompt }: { prompt: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // Clipboard permission can be denied by the browser; the button
      // still reflects the attempt so the UI never feels stuck.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Fix prompt for your coding agent</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Hand this back to the agent that opened this PR to close the gap.
      </p>
      <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">{prompt}</pre>
        <button
          onClick={handleCopy}
          className="mt-3 flex items-center gap-1.5 rounded border border-border bg-background px-2 py-1 text-xs font-medium hover:bg-accent"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy prompt
            </>
          )}
        </button>
      </div>
    </div>
  );
}
