"use client";

import { ArrowRight, FolderKanban } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrdinoStore } from "@/lib/store";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  const setActiveProjectId = useOrdinoStore((state) => state.setActiveProjectId);
  const activeProjectId = useOrdinoStore((state) => state.activeProjectId);
  const integrations = useOrdinoStore((state) => state.integrations);
  const router = useRouter();

  const isActive = project.id === activeProjectId;
  const connectedIntegrations = integrations.filter((integration) =>
    project.integrationIds.includes(integration.id),
  );

  function handleOpenChat(event: React.MouseEvent) {
    event.stopPropagation();
    setActiveProjectId(project.id);
    router.push("/chat");
  }

  function handleOpenProjectPage() {
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      onClick={handleOpenProjectPage}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleOpenProjectPage();
      }}
      role="link"
      tabIndex={0}
      className="flex cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
    >
      <div>
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </div>
          {isActive && (
            <Badge variant="secondary" className="ordino-gradient-text font-medium">
              Active
            </Badge>
          )}
        </div>
        <h3 className="mt-3 text-sm font-semibold">{project.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {connectedIntegrations.length > 0 ? (
            connectedIntegrations.map((integration) => (
              <Badge key={integration.id} variant="outline" className="text-xs">
                {integration.name}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">No integrations connected</span>
          )}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenChat}
        className="mt-3 justify-start px-0 text-sm text-muted-foreground hover:text-foreground"
      >
        Open project
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
