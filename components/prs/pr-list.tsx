import Link from "next/link";
import { Bot, CheckCircle2, GitPullRequest, ShieldCheck, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { StatTile } from "@/components/quality/stat-tile";
import { getEffectiveVerdict, getProjectTrackRecord } from "@/lib/mock-data/pull-requests";
import type { PullRequest } from "@/lib/mock-data/pull-requests";

export function PrList({
  projectId,
  pullRequests,
  dismissedFlowIds,
}: {
  projectId: string;
  pullRequests: PullRequest[];
  dismissedFlowIds: string[];
}) {
  if (pullRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
        <GitPullRequest className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm font-medium">No pull requests to verify yet</p>
        <p className="text-sm text-muted-foreground">
          Connect a GitHub integration to see Ordino verify incoming PRs here.
        </p>
      </div>
    );
  }

  const trackRecord = getProjectTrackRecord(projectId, dismissedFlowIds);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile label="PRs verified" value={`${trackRecord.verifiedCount}`} />
        <StatTile label="Regressions caught" value={`${trackRecord.caughtCount}`} />
        <StatTile label="Flags overturned" value={`${trackRecord.overturnedCount}`} />
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">Pull requests</h3>
        <div className="mt-3 flex flex-col divide-y divide-border">
          {pullRequests.map((pr) => {
            const safe = getEffectiveVerdict(pr, dismissedFlowIds) === "safe_to_merge";
            return (
              <Link
                key={pr.id}
                href={`/projects/${projectId}/prs/${pr.id}`}
                className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 truncate text-sm font-medium">
                    #{pr.number} {pr.title}
                    {pr.preVerified && (
                      <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" aria-label="Pre-verified by Ordino" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Bot className="h-3 w-3" />
                    {pr.author} · {pr.createdAgo}
                  </div>
                </div>
                <div
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 text-xs font-medium",
                    safe ? "text-success" : "text-destructive",
                  )}
                >
                  {safe ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                  {safe ? "Safe to merge" : "Regression found"}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
