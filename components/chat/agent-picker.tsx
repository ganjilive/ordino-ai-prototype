"use client";

import { Sparkles } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { agents } from "@/lib/mock-data/agents";
import { useOrdinoStore } from "@/lib/store";

export function AgentPicker() {
  const pinnedAgentId = useOrdinoStore((state) => state.pinnedAgentId);
  const setPinnedAgentId = useOrdinoStore((state) => state.setPinnedAgentId);

  return (
    <Select
      value={pinnedAgentId}
      onValueChange={(value) => setPinnedAgentId(value ?? "auto")}
    >
      <SelectTrigger size="sm" className="w-auto gap-1.5 border-none bg-transparent shadow-none hover:bg-accent">
        <SelectValue>
          {(value: string) => {
            if (value === "auto") {
              return (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                  Auto
                </>
              );
            }
            const agent = agents.find((a) => a.id === value);
            if (!agent) return "Auto";
            return (
              <>
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: agent.color }}
                />
                {agent.name}
              </>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem value="auto">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          Auto (recommended)
        </SelectItem>
        {agents.map((agent) => (
          <SelectItem key={agent.id} value={agent.id}>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: agent.color }}
            />
            {agent.name}
            <span className="ml-1 text-xs text-muted-foreground">
              ({agent.tier === "local" ? "Local" : "Cloud"})
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
