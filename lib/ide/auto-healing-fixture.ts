import type { IdeScriptedStep } from "@/lib/ide/types";

export const autoHealingSteps: IdeScriptedStep[] = [
  { delayMs: 500, content: "Scanning for selector drift across the active E2E suite…" },
  {
    delayMs: 700,
    content:
      'Found one: checkout-payment.e2e.spec.ts was asserting against a button labeled "Pay now" — renamed to "Complete purchase" 2 days ago. The test has been failing since.',
  },
  {
    delayMs: 700,
    content:
      "Healed automatically: getByText('Pay now') → getByText('Complete purchase'). No human review needed for a label-only change — logged for audit. I'll flag it for a human if the same selector needs healing more than twice in 30 days.",
  },
];
