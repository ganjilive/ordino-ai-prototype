"use client";

import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Undo2, XCircle } from "lucide-react";

import type { UserFlowCheck } from "@/lib/mock-data/pull-requests";

export function FlowCheckItem({
  flow,
  dismissed,
  onToggleDismiss,
}: {
  flow: UserFlowCheck;
  dismissed: boolean;
  onToggleDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(flow.status === "failed");
  const passed = flow.status === "passed";
  const failed = flow.status === "failed" && !dismissed;

  return (
    <div className="py-2.5 first:pt-0 last:pb-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {expanded ? (
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )}
          {flow.flowName}
        </div>
        <div
          className={
            "flex shrink-0 items-center gap-1.5 text-xs font-medium " +
            (passed ? "text-success" : failed ? "text-destructive" : "text-muted-foreground")
          }
        >
          {passed ? (
            <CheckCircle2 className="h-3.5 w-3.5" />
          ) : failed ? (
            <XCircle className="h-3.5 w-3.5" />
          ) : (
            <Undo2 className="h-3.5 w-3.5" />
          )}
          {passed ? "Passed" : failed ? "Failed" : "Dismissed"}
        </div>
      </button>

      {expanded && (
        <div className="mt-2 ml-5 space-y-2">
          <ol className="list-decimal space-y-1 pl-4 text-xs text-muted-foreground">
            {flow.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          {flow.finding && (
            <div
              className={
                "space-y-2 rounded-md border p-2.5 text-xs " +
                (failed
                  ? "border-destructive/30 bg-destructive/10 text-foreground"
                  : "border-border bg-muted/40 text-muted-foreground")
              }
            >
              <p>{flow.finding}</p>
              {dismissed && <p className="italic">You marked this as not a regression.</p>}
            </div>
          )}
          {flow.status === "failed" && (
            <button
              onClick={onToggleDismiss}
              className="flex items-center gap-1.5 rounded border border-border bg-card px-2 py-1 text-xs font-medium hover:bg-accent"
            >
              {dismissed ? (
                <>
                  <Undo2 className="h-3.5 w-3.5" />
                  Undo
                </>
              ) : (
                "Mark as not a regression"
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
