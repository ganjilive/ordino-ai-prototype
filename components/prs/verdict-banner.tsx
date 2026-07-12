import { CheckCircle2, XCircle } from "lucide-react";

import { countOverturnedFlows, getEffectiveVerdict } from "@/lib/mock-data/pull-requests";
import type { PullRequest } from "@/lib/mock-data/pull-requests";

export function VerdictBanner({
  pr,
  dismissedFlowIds,
}: {
  pr: PullRequest;
  dismissedFlowIds: string[];
}) {
  const passedCount = pr.flows.filter((f) => f.status === "passed").length;
  const overturnedCount = countOverturnedFlows(pr, dismissedFlowIds);
  const safe = getEffectiveVerdict(pr, dismissedFlowIds) === "safe_to_merge";

  return (
    <div
      className={
        safe
          ? "rounded-lg border border-success/30 bg-success/10 p-4"
          : "rounded-lg border border-destructive/30 bg-destructive/10 p-4"
      }
    >
      <div className={"flex items-center gap-2 text-sm font-semibold " + (safe ? "text-success" : "text-destructive")}>
        {safe ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {safe
          ? `All ${pr.flows.length} user flows verified — safe to merge`
          : "Regression found — do not merge"}
        {safe && overturnedCount > 0 && (
          <span className="font-normal text-muted-foreground">
            ({overturnedCount} flag{overturnedCount === 1 ? "" : "s"} overturned by you)
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{pr.summary}</p>
      {!safe && (
        <p className="mt-1 text-xs text-muted-foreground">
          {passedCount} of {pr.flows.length} flows passed.
        </p>
      )}
    </div>
  );
}
