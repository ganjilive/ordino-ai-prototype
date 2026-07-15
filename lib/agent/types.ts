export type AgentStepKind =
  | "tool"
  | "result"
  | "text"
  | "diff"
  | "success"
  | "ordino-call"
  | "ordino-result";

export interface AgentDiff {
  filePath: string;
  before: string;
  after: string;
}

export interface AgentStep {
  id: string;
  kind: AgentStepKind;
  delayMs: number;
  text?: string;
  diff?: AgentDiff;
}
