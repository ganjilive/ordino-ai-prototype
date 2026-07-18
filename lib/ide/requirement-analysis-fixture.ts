import type { IdeScriptedStep } from "@/lib/ide/types";

export const requirementAnalysisSteps: IdeScriptedStep[] = [
  { delayMs: 500, content: "Pulling BOOK-510 from Jira…" },
  {
    delayMs: 600,
    content:
      '"As a guest, I can redeem loyalty points at checkout to reduce my total." — that\'s the only acceptance criterion on the ticket.',
  },
  {
    delayMs: 800,
    content:
      "Before this is ready for development, I'd want three things clarified:\n\n1. What happens to redeemed points if the order is later refunded?\n2. Is there a maximum percentage of the order that can be paid with points?\n3. How does point redemption interact with a promo code applied to the same order?\n\nNone of these are answered right now — the kind of gap that turns into mid-sprint rework rather than a quick clarification up front.",
  },
];
