export type TerminalCompanionStepKind =
  | "banner-title" // "✻ Welcome to Ordino!"
  | "banner-line" // secondary banner lines (hint, cwd)
  | "tool" // "● Checking coverage snapshot…"
  | "tool-result" // "⎿ 71% overall (+5 pts)"
  | "finding" // unprompted, cross-repo risk flag — visually distinct
  | "prompt" // the developer's typed question, echoed as a `>` line
  | "answer" // Ordino's response
  | "traceability"; // requirement ↔ generated-test link — visually distinct

export interface TerminalCompanionStep {
  id: string;
  kind: TerminalCompanionStepKind;
  delayMs: number;
  text: string;
}
