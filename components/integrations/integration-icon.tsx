import {
  BookOpen,
  Cloud,
  Database,
  FileText,
  FolderGit2,
  GitBranch,
  Kanban,
  ListChecks,
  MessagesSquare,
} from "lucide-react";

import type { IntegrationType } from "@/lib/types";

const iconByType: Record<IntegrationType, React.ComponentType<{ className?: string }>> = {
  jira: Kanban,
  confluence: BookOpen,
  notion: FileText,
  linear: ListChecks,
  github: FolderGit2,
  bitbucket: GitBranch,
  slack: MessagesSquare,
  "google-drive": Cloud,
  database: Database,
};

export function IntegrationIcon({ type, className }: { type: IntegrationType; className?: string }) {
  const Icon = iconByType[type];
  return <Icon className={className} />;
}
