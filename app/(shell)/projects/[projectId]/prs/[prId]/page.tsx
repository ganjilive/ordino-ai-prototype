"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, GitMerge, Lock } from "lucide-react";

import { PrHeader } from "@/components/prs/pr-header";
import { VerdictBanner } from "@/components/prs/verdict-banner";
import { FlowCheckList } from "@/components/prs/flow-check-list";
import { FixPromptCard } from "@/components/prs/fix-prompt-card";
import { getEffectiveVerdict, getPullRequest } from "@/lib/mock-data/pull-requests";
import { useOrdinoStore } from "@/lib/store";

export default function PullRequestPage({
  params,
}: {
  params: Promise<{ projectId: string; prId: string }>;
}) {
  const { projectId, prId } = use(params);
  const [merged, setMerged] = useState(false);
  const dismissedFlowIds = useOrdinoStore((state) => state.dismissedFlowIds);
  const toggleFlowDismissed = useOrdinoStore((state) => state.toggleFlowDismissed);
  const requireVerificationPolicy = useOrdinoStore((state) => state.requireVerificationPolicy);

  const pr = getPullRequest(prId);

  if (!pr || pr.projectId !== projectId) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-muted-foreground">
        Pull request not found.
      </div>
    );
  }

  const safe = getEffectiveVerdict(pr, dismissedFlowIds) === "safe_to_merge";
  const blocked = !safe && (requireVerificationPolicy[projectId] ?? false);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link
        href={`/projects/${projectId}`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to project
      </Link>

      <div className="mt-4">
        <PrHeader pr={pr} />
      </div>

      <div className="mt-6">
        <VerdictBanner pr={pr} dismissedFlowIds={dismissedFlowIds} />
      </div>

      <div className="mt-4">
        <FlowCheckList
          flows={pr.flows}
          dismissedFlowIds={dismissedFlowIds}
          onToggleDismiss={toggleFlowDismissed}
        />
      </div>

      {pr.fixPrompt && (
        <div className="mt-4">
          <FixPromptCard prompt={pr.fixPrompt} />
        </div>
      )}

      <div className="mt-6">
        <button
          onClick={() => setMerged(true)}
          disabled={merged || blocked}
          className={
            "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium disabled:opacity-70 " +
            (safe
              ? "border-success/40 bg-success/10 text-success hover:bg-success/20"
              : "border-border bg-card text-muted-foreground hover:bg-accent")
          }
        >
          {merged ? (
            <>
              <Check className="h-4 w-4" />
              Merged
            </>
          ) : blocked ? (
            <>
              <Lock className="h-4 w-4" />
              Merging blocked by policy
            </>
          ) : (
            <>
              <GitMerge className="h-4 w-4" />
              {safe ? "Merge pull request" : "Merge anyway"}
            </>
          )}
        </button>
        {blocked && (
          <p className="mt-2 text-xs text-muted-foreground">
            This project requires Ordino verification before merging agent PRs. Dismiss the finding
            above or ask the agent to fix it to merge.
          </p>
        )}
      </div>
    </div>
  );
}
