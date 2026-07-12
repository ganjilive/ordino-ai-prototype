"use client";

import { use, useEffect } from "react";

import { ProjectChatPanel } from "@/components/projects/project-chat-panel";
import { QualityDashboard } from "@/components/quality/quality-dashboard";
import { QualityEmptyState } from "@/components/quality/quality-empty-state";
import { PrList } from "@/components/prs/pr-list";
import { MergePolicyToggle } from "@/components/prs/merge-policy-toggle";
import { AgentTrustPanel } from "@/components/prs/agent-trust-panel";
import { getQualitySnapshot } from "@/lib/mock-data/quality";
import { getPullRequestsForProject } from "@/lib/mock-data/pull-requests";
import { useOrdinoStore } from "@/lib/store";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  const projects = useOrdinoStore((state) => state.projects);
  const conversations = useOrdinoStore((state) => state.conversations);
  const setActiveProjectId = useOrdinoStore((state) => state.setActiveProjectId);
  const setActiveConversationId = useOrdinoStore((state) => state.setActiveConversationId);
  const dismissedFlowIds = useOrdinoStore((state) => state.dismissedFlowIds);

  const project = projects.find((p) => p.id === projectId);
  const snapshot = getQualitySnapshot(projectId);
  const pullRequests = getPullRequestsForProject(projectId);

  useEffect(() => {
    if (!project) return;
    setActiveProjectId(projectId);
    const latest = [...conversations]
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latest) {
      setActiveConversationId(latest.id);
    }
    // Runs once per projectId only: setActiveProjectId resets
    // activeConversationId to null, so including `conversations` here
    // would re-fire on every sent message and fight the chat panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="min-w-0 flex-1 overflow-y-auto px-6 py-8">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>

        {pullRequests.length > 0 && (
          <div className="mt-6">
            <MergePolicyToggle projectId={projectId} />
          </div>
        )}

        <div className="mt-6">
          <PrList projectId={projectId} pullRequests={pullRequests} dismissedFlowIds={dismissedFlowIds} />
        </div>

        {pullRequests.length > 0 && (
          <div className="mt-6">
            <AgentTrustPanel
              projectId={projectId}
              pullRequests={pullRequests}
              dismissedFlowIds={dismissedFlowIds}
            />
          </div>
        )}

        <div className="mt-6">
          {snapshot ? <QualityDashboard snapshot={snapshot} /> : <QualityEmptyState />}
        </div>
      </div>

      <div className="w-[400px] shrink-0">
        <ProjectChatPanel projectId={projectId} />
      </div>
    </div>
  );
}
