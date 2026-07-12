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
  { id: "step-12", kind: "tool", delayMs: 600, text: "Ordino(verify-flows --before-pr)" },
  {
    id: "step-13",
    kind: "output",
    delayMs: 900,
    text: "Checking the user flows this change touches before opening a PR…\n\n✓ Guest checkout, single item, no promo code\n✓ Returning customer checkout, promo code applied\n✗ Order confirmation email after a promo-code checkout\n  Finding: src/emails/order-confirmation.ts computes its own total from subtotal directly instead of calling calculateTotal(), so the confirmation email still shows the old pre-discount, over-taxed total — customers would see a different number in their inbox than what they were actually charged.\n\n2 of 3 flows passed.",
  },
  {
    id: "step-14",
    kind: "text",
    delayMs: 700,
    text: "Good catch — the email template duplicates the total calculation instead of reusing calculateTotal(). Fixing that before opening the PR.",
  },
  { id: "step-15", kind: "tool", delayMs: 450, text: "Read(src/emails/order-confirmation.ts)" },
  { id: "step-16", kind: "result", delayMs: 350, text: "Read 18 lines" },
  { id: "step-17", kind: "tool", delayMs: 500, text: "Edit(src/emails/order-confirmation.ts)" },
  {
    id: "step-18",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: "src/emails/order-confirmation.ts",
      before: "  const total = subtotal + tax;",
      after: "  const total = calculateTotal({ subtotal, discount, promoCode });",
    },
  },
  { id: "step-19", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-20", kind: "tool", delayMs: 600, text: "Ordino(verify-flows --before-pr)" },
  {
    id: "step-21",
    kind: "output",
    delayMs: 800,
    text: "✓ Guest checkout, single item, no promo code\n✓ Returning customer checkout, promo code applied\n✓ Order confirmation email after a promo-code checkout\n\n3 of 3 flows passed. Safe to open the PR.",
  },
  {
    id: "step-22",
    kind: "success",
    delayMs: 400,
    text: 'Done — opening PR #490 "Fix tax calculated before discount" for review. Ordino verified all 3 impacted flows before this PR existed.',
  },
];
