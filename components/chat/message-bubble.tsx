import { agents } from "@/lib/mock-data/agents";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const agent = agents.find((a) => a.id === message.agentId);

  if (message.role === "system") {
    return (
      <div className="flex items-center justify-center py-1">
        <span className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
          {agent && (
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: agent.color }}
            />
          )}
          {message.content}
          {agent && (
            <span className="font-medium text-foreground">
              {agent.name} ({agent.tier === "local" ? "Local" : "Cloud"})
            </span>
          )}
        </span>
      </div>
    );
  }

  const isUser = message.role === "user";

  return (
    <div className={cn("flex flex-col gap-1", isUser ? "items-end" : "items-start")}>
      {!isUser && agent && (
        <div className="flex items-center gap-1.5 px-1 text-xs text-muted-foreground">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: agent.color }}
          />
          <span className="font-medium text-foreground">{agent.name}</span>
          <span>({agent.tier === "local" ? "Local" : "Cloud"})</span>
        </div>
      )}
      <div
        className={cn(
          "max-w-2xl whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "ordino-gradient-bg text-white"
            : "bg-card text-card-foreground border border-border",
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
