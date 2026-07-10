"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import type { RecommendedFix } from "@/lib/ide/types";

export function RecommendedFixCard({ fix }: { fix: RecommendedFix }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fix.prompt);
    } catch {
      // Clipboard permission can be denied by the browser; the button
      // still reflects the attempt so the UI never feels stuck.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[#252526]">
      <div className="border-b border-white/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#e5c07b]">
        Recommended fix
      </div>
      <div className="px-3 py-2 text-[13px] leading-relaxed text-[#cccccc]">
        {fix.explanation}
      </div>
      <div className="mx-3 mb-3 rounded-md border border-white/10 bg-[#1e1e1e] p-2.5">
        <pre className="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-[#d4d4d4]">
          {fix.prompt}
        </pre>
        <button
          onClick={handleCopy}
          className="mt-2 flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-[#cccccc] hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#89d185]" />
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
