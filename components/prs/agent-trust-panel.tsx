import { Bot } from "lucide-react";

import { getAgentTrackRecords } from "@/lib/mock-data/pull-requests";
import type { PullRequest } from "@/lib/mock-data/pull-requests";

export function AgentTrustPanel({
  projectId,
  pullRequests,
  dismissedFlowIds,
}: {
  projectId: string;
  pullRequests: PullRequest[];
  dismissedFlowIds: string[];
}) {
  if (pullRequests.length === 0) return null;

  const records = getAgentTrackRecords(projectId, dismissedFlowIds);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Agent trust</h3>
      <div className="mt-3 flex flex-col divide-y divide-border">
        {records.map((record) => (
          <div key={record.agentName} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Bot className="h-3.5 w-3.5 text-muted-foreground" />
              {record.agentName}
            </div>
            <div className="text-xs text-muted-foreground">
              {record.verifiedCount} PR{record.verifiedCount === 1 ? "" : "s"} verified ·{" "}
              {record.caughtCount} regression{record.caughtCount === 1 ? "" : "s"} caught ·{" "}
              <span className="text-foreground">
                {record.cleanCount}/{record.verifiedCount}
              </span>{" "}
              clean
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
