"use client";

import { Files, GitBranch, Play, Puzzle, Search, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type IdeActivityView, useIde } from "@/components/ide/ide-context";

const VIEWS: { id: IdeActivityView; label: string; icon: typeof Files }[] = [
  { id: "explorer", label: "Explorer", icon: Files },
  { id: "search", label: "Search", icon: Search },
  { id: "git", label: "Source Control", icon: GitBranch },
  { id: "run", label: "Run and Debug", icon: Play },
  { id: "extensions", label: "Extensions", icon: Puzzle },
];

function ActivityIconButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        aria-label={label}
        className={cn(
          "relative flex h-11 w-11 items-center justify-center text-[#858585] hover:text-white",
          active && "text-white",
        )}
      >
        {active && <span className="absolute left-0 h-6 w-0.5 bg-white" aria-hidden />}
        {children}
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function ActivityBar() {
  const { activityView, setActivityView, ordinoPanelOpen, setOrdinoPanelOpen } = useIde();

  return (
    <div className="flex w-12 shrink-0 flex-col items-center justify-between bg-[#333333] py-2">
      <div className="flex flex-col items-center">
        {VIEWS.map(({ id, label, icon: Icon }) => (
          <ActivityIconButton
            key={id}
            label={label}
            active={activityView === id}
            onClick={() => setActivityView(id as IdeActivityView)}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </ActivityIconButton>
        ))}
      </div>
      <div className="flex flex-col items-center">
        <ActivityIconButton
          label="Ordino"
          active={ordinoPanelOpen}
          onClick={() => setOrdinoPanelOpen(!ordinoPanelOpen)}
        >
          <span className="ordino-gradient-bg flex h-6 w-6 items-center justify-center rounded-md">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </span>
        </ActivityIconButton>
      </div>
    </div>
  );
}
