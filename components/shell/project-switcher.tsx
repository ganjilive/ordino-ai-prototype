"use client";

import { ChevronsUpDown, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrdinoStore } from "@/lib/store";

export function ProjectSwitcher() {
  const projects = useOrdinoStore((state) => state.projects);
  const activeProjectId = useOrdinoStore((state) => state.activeProjectId);
  const setActiveProjectId = useOrdinoStore((state) => state.setActiveProjectId);

  const activeProject =
    projects.find((project) => project.id === activeProjectId) ?? projects[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent focus:outline-none">
        <FolderKanban className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="max-w-48 truncate">{activeProject?.name ?? "Select a project"}</span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {projects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onSelect={() => setActiveProjectId(project.id)}
            className="flex flex-col items-start gap-0.5"
          >
            <span className="text-sm font-medium">{project.name}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {project.description}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/projects" />}>
          <Plus className="h-4 w-4" />
          New project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
