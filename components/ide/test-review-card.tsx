"use client";

import { useState } from "react";
import { Check, GitCommitHorizontal, GitPullRequest } from "lucide-react";

import { allFilePaths } from "@/lib/ide/file-tree";
import { githubOrgRepos, shortRepoName } from "@/lib/mock-data/github-repos";
import type { TestFileSummary, TestReview } from "@/lib/ide/types";
import { useIde } from "@/components/ide/ide-context";

function groupFilesByRepo(files: TestFileSummary[]): Record<string, TestFileSummary[]> {
  const groups: Record<string, TestFileSummary[]> = {};
  for (const file of files) {
    (groups[file.repo] ??= []).push(file);
  }
  return groups;
}

export function TestReviewCard({
  review,
  onPrOpened,
}: {
  review: TestReview;
  /** Called once, right when a repo's "Open PR" button is clicked (not "Commit changes"). */
  onPrOpened?: (repoFullName: string) => void;
}) {
  const { openFile } = useIde();
  const [resolvedRepos, setResolvedRepos] = useState<Set<string>>(new Set());

  const groups = groupFilesByRepo(review.files);
  const repoOrder = Object.keys(groups);

  return (
    <div className="rounded-lg border border-white/10 bg-[#252526]">
      <div className="border-b border-white/10 px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#e5c07b]">
        Ready for review
      </div>
      <div className="px-3 py-2 text-[13px] leading-relaxed text-[#cccccc]">{review.summary}</div>

      {repoOrder.map((repoFullName) => {
        const files = groups[repoFullName];
        const repoMeta = githubOrgRepos.find((repo) => repo.fullName === repoFullName);
        const ownedByYourTeam = repoMeta?.ownedByYourTeam ?? false;
        const resolved = resolvedRepos.has(repoFullName);
        const label = shortRepoName(repoFullName);
        const message = review.commitMessagesByRepo[repoFullName];

        return (
          <div
            key={repoFullName}
            className="mx-3 mb-3 space-y-1.5 rounded-md border border-white/10 bg-[#1e1e1e] p-2.5"
          >
            {repoOrder.length > 1 && (
              <div className="text-[11px] font-semibold uppercase tracking-wide text-[#969696]">{label}</div>
            )}
            {files.map((file) => (
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
              onClick={() => {
                setResolvedRepos((prev) => new Set(prev).add(repoFullName));
                if (!ownedByYourTeam) {
                  onPrOpened?.(repoFullName);
                }
              }}
              disabled={resolved}
              className="mt-2 flex items-center gap-1.5 rounded border border-white/10 bg-white/5 px-2 py-1 text-[12px] text-[#cccccc] hover:bg-white/10 disabled:opacity-70"
            >
              {ownedByYourTeam ? (
                resolved ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#89d185]" />
                    Committed — {message}
                  </>
                ) : (
                  <>
                    <GitCommitHorizontal className="h-3.5 w-3.5" />
                    Commit changes
                  </>
                )
              ) : resolved ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#e5c07b]" />
                  PR opened — awaiting review from {label}
                </>
              ) : (
                <>
                  <GitPullRequest className="h-3.5 w-3.5" />
                  Open PR
                </>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
