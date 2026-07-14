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
  /** Matches GithubRepoOption.fullName in lib/mock-data/github-repos.ts */
  repo: string;
}

export interface TestReview {
  summary: string;
  files: TestFileSummary[];
  /**
   * Keyed by repo fullName. For repos the developer's team owns, this is a
   * commit message; for repos owned by another team, it's the PR title.
   */
  commitMessagesByRepo: Record<string, string>;
  /**
   * Keyed by repo fullName. Present only for repos owned by another team —
   * the message body Ordino "sends" via Slack to that repo's lead when the
   * PR is opened, explaining the change and the reasoning behind it.
   */
  slackNotificationsByRepo?: Record<string, string>;
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
  /** Icon for role === "event" pills. Defaults to the Zap (proactive-trigger) icon when absent. */
  eventIcon?: "zap" | "slack";
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
