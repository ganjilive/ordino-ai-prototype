import { agents, defaultAgentId } from "@/lib/mock-data/agents";
import {
  genericFallbackByAgent,
  scriptedResponses,
} from "@/lib/mock-data/responses";

export interface RoutingResult {
  agentId: string;
  content: string;
  /** True when auto-routing picked a different agent than the previous message used. */
  switched: boolean;
}

function findAgentByKeyword(message: string): string | undefined {
  const lower = message.toLowerCase();
  return agents.find((agent) =>
    agent.keywords.some((keyword) => lower.includes(keyword)),
  )?.id;
}

export function routeMessage(
  message: string,
  previousAgentId: string | undefined,
): RoutingResult {
  const lower = message.toLowerCase();

  const scriptMatch = scriptedResponses.find((response) =>
    response.triggers.some((trigger) => lower.includes(trigger)),
  );

  let agentId: string;
  let content: string;

  if (scriptMatch) {
    agentId = scriptMatch.agentId;
    content = scriptMatch.content;
  } else {
    agentId = findAgentByKeyword(message) ?? defaultAgentId;
    content =
      genericFallbackByAgent[agentId] ??
      "I can help with that — could you give me a bit more detail on what you'd like me to do?";
  }

  return {
    agentId,
    content,
    switched: previousAgentId !== undefined && previousAgentId !== agentId,
  };
}
