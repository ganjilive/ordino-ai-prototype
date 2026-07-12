export interface IdeFolderNode {
  type: "folder";
  name: string;
  path: string;
  children: IdeNode[];
}

export interface IdeFileNode {
  type: "file";
  name: string;
  path: string;
  language: string;
}

export type IdeNode = IdeFolderNode | IdeFileNode;

export type CodeTokenKind =
  | "plain"
  | "keyword"
  | "string"
  | "comment"
  | "type"
  | "function"
  | "number"
  | "punct";

export interface CodeToken {
  text: string;
  kind?: CodeTokenKind;
}

export type CodeLine = CodeToken[];

export interface RecommendedFix {
  explanation: string;
  prompt: string;
}

export interface TestFileSummary {
  path: string;
  description: string;
}

export interface TestReview {
  summary: string;
  files: TestFileSummary[];
  commitMessage: string;
}

export interface StepOffer {
  label: string;
  followup: IdeScriptedStep[];
}

export interface IdeChatMessage {
  id: string;
  role: "user" | "assistant" | "event";
  content: string;
  fix?: RecommendedFix;
  review?: TestReview;
  proactive?: boolean;
  offer?: StepOffer;
}

export interface IdeScriptedStep {
  delayMs: number;
  content: string;
  fix?: RecommendedFix;
  review?: TestReview;
  proactive?: boolean;
  offer?: StepOffer;
}

export type TerminalStepKind =
  | "tool"
  | "result"
  | "text"
  | "diff"
  | "output"
  | "success";

export interface TerminalDiff {
  filePath: string;
  before: string;
  after: string;
}

export interface TerminalStep {
  id: string;
  kind: TerminalStepKind;
  delayMs: number;
  text?: string;
  diff?: TerminalDiff;
}
