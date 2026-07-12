import { FlowCheckItem } from "@/components/prs/flow-check-item";
import type { UserFlowCheck } from "@/lib/mock-data/pull-requests";

export function FlowCheckList({
  flows,
  dismissedFlowIds,
  onToggleDismiss,
}: {
  flows: UserFlowCheck[];
  dismissedFlowIds: string[];
  onToggleDismiss: (flowId: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">User flows verified</h3>
      <div className="mt-1 flex flex-col divide-y divide-border">
        {flows.map((flow) => (
          <FlowCheckItem
            key={flow.id}
            flow={flow}
            dismissed={dismissedFlowIds.includes(flow.id)}
            onToggleDismiss={() => onToggleDismiss(flow.id)}
          />
        ))}
      </div>
    </div>
  );
}
