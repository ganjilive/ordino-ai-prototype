"use client";

import { useState } from "react";
import { Check, GitCommitHorizontal } from "lucide-react";

import { allFilePaths } from "@/lib/ide/file-tree";
import type { TestReview } from "@/lib/ide/types";
import { useIde } from "@/components/ide/ide-context";

export function TestReviewCard({ review }: { review: TestReview }) {
  const { openFile } = useIde();
  const [committed, setCommitted] = useState(false);

  return (
    <div className="rounded-lg border border-white/10 bg-[#252526]">
      <div className="border-b border-white/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#e5c07b]">
        Ready for review
      </div>
      <div className="px-3 py-2 text-[13px] leading-relaxed text-[#cccccc]">{review.summary}</div>
      <div className="mx-3 mb-3 space-y-1.5 rounded-md border border-white/10 bg-[#1e1e1e] p-2.5">
        {review.files.map((file) => (
          <div key={file.path} className="text-[12px] leading-relaxed">
            {allFilePaths.includes(file.path) ? (
              <button
                onClick={() => openFile(file.path)}
                className="rounded bg-white/10 px-1 py-0.5 font-mono text-[#4ec9b0] hover:bg-white/20"
              >
                {file.path}
              </button>
            ) : (
              <span className="rounded bg-white/5 px-1 py-0.5 font-mono text-[#9da5b4]">{file.path}</span>
            )}
            <span className="ml-1.5 text-[#969696]">{file.description}</span>
          </div>
        ))}
        <button
          onClick={() => setCommitted(true)}
          disabled={committed}
          className="mt-2 flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-[#cccccc] hover:bg-white/10 disabled:opacity-70"
        >
          {committed ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#89d185]" />
              Committed — {review.commitMessage}
            </>
          ) : (
            <>
              <GitCommitHorizontal className="h-3.5 w-3.5" />
              Commit changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
