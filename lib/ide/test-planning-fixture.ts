import type { IdeScriptedStep } from "@/lib/ide/types";

export const testPlanningSteps: IdeScriptedStep[] = [
  {
    delayMs: 500,
    content: "Cross-referencing booking-website, loyalty-service, and booking-api before proposing a split…",
  },
  {
    delayMs: 800,
    content:
      "Here's the split I'd recommend for BOOK-510:\n\n- Developer/unit tests (booking-website): points-balance validation, redemption math\n- Integration tests: the call to loyalty-service's ledger API, where points actually get deducted\n- System/e2e tests (staging): the full redemption flow end to end, including combining a promo code with points in the same order\n\nThat last combination case is the highest-risk one to miss if we only test the happy path.",
  },
];
