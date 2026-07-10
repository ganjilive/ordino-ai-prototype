import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TestRun } from "@/lib/mock-data/quality";

export function TestRunList({ runs }: { runs: TestRun[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Latest test runs</h3>
      <div className="mt-3 flex flex-col divide-y divide-border">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{run.suite}</div>
              <div className="text-xs text-muted-foreground">
                {run.testType} · {run.ranAgo}
                {run.note ? ` · ${run.note}` : ""}
              </div>
            </div>
            <div
              className={cn(
                "flex shrink-0 items-center gap-1.5 text-xs font-medium",
                run.status === "passed" ? "text-success" : "text-destructive",
              )}
            >
              {run.status === "passed" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {run.status === "passed" ? "Passed" : "Failed"}
              <span className="text-muted-foreground">
                {run.passedCount}/{run.totalCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
