import { Bot, CheckCircle2, GitBranch, ShieldCheck } from "lucide-react";

import type { PullRequest } from "@/lib/mock-data/pull-requests";

export function PrHeader({ pr }: { pr: PullRequest }) {
  const additions = pr.filesChanged.reduce((sum, f) => sum + f.additions, 0);
  const deletions = pr.filesChanged.reduce((sum, f) => sum + f.deletions, 0);

  return (
    <div>
      <h1 className="text-xl font-semibold">
        #{pr.number} {pr.title}
      </h1>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Bot className="h-3.5 w-3.5" />
          Opened by {pr.author} · {pr.createdAgo}
        </span>
        <span className="flex items-center gap-1.5">
          <GitBranch className="h-3.5 w-3.5" />
          {pr.branch}
        </span>
        <span className="flex items-center gap-1.5 text-success">
          <CheckCircle2 className="h-3.5 w-3.5" />
          CI passed
        </span>
        {pr.preVerified && (
          <span className="flex items-center gap-1.5 text-success">
            <ShieldCheck className="h-3.5 w-3.5" />
            Pre-verified by Ordino before this PR was opened
          </span>
        )}
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <div className="text-xs font-medium text-muted-foreground">
          {pr.filesChanged.length} file{pr.filesChanged.length === 1 ? "" : "s"} changed ·{" "}
          <span className="text-success">+{additions}</span>{" "}
          <span className="text-destructive">-{deletions}</span>
        </div>
        <div className="mt-2 flex flex-col gap-1">
          {pr.filesChanged.map((file) => (
            <div key={file.path} className="flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-mono text-foreground">{file.path}</span>
              <span className="shrink-0 text-muted-foreground">
                <span className="text-success">+{file.additions}</span>{" "}
                <span className="text-destructive">-{file.deletions}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
