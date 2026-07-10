import { bugFixture } from "@/lib/ide/bug-fixture";
import type { TerminalStep } from "@/lib/ide/types";

export const terminalScript: TerminalStep[] = [
  { id: "step-1", kind: "tool", delayMs: 400, text: "Read(src/lib/pricing.ts)" },
  { id: "step-2", kind: "result", delayMs: 350, text: "Read 25 lines" },
  { id: "step-3", kind: "tool", delayMs: 500, text: "Read(src/lib/promotions.ts)" },
  { id: "step-4", kind: "result", delayMs: 350, text: "Read 14 lines" },
  {
    id: "step-5",
    kind: "text",
    delayMs: 800,
    text: "The bug is in calculateTotal — tax is computed on the pre-discount subtotal, so discounted orders overpay tax. I'll compute tax after applying the discount.",
  },
  { id: "step-6", kind: "tool", delayMs: 500, text: "Edit(src/lib/pricing.ts)" },
  {
    id: "step-7",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: bugFixture.filePath,
      before: bugFixture.before,
      after: bugFixture.after,
    },
  },
  { id: "step-8", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-9", kind: "tool", delayMs: 600, text: "Bash(npm test -- pricing)" },
  {
    id: "step-10",
    kind: "output",
    delayMs: 550,
    text: "PASS  src/lib/pricing.test.ts\n  calculateTotal\n    ✓ applies tax to the full subtotal with no promo code\n    ✓ applies tax after the discount when a promo code is used\n\nTest Suites: 1 passed, 1 total\nTests:       6 passed, 6 total",
  },
  {
    id: "step-11",
    kind: "success",
    delayMs: 350,
    text: "Done — checkout totals now apply tax after the promo code discount.",
  },
];
