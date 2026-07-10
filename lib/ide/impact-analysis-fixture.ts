import type { IdeScriptedStep } from "@/lib/ide/types";

export const impactAnalysisSteps: IdeScriptedStep[] = [
  {
    delayMs: 700,
    content:
      "Scanning the repositories I have access to for anything touching the checkout total change: booking-website (this repo), booking-api, booking-mobile…",
  },
  {
    delayMs: 1500,
    content:
      "Impact analysis for the calculateTotal() change in src/lib/pricing.ts:\n• booking-website — src/components/checkout/order-summary.tsx renders the total directly; e2e checkout flow depends on it.\n• booking-api — POST /checkout/quote recomputes the same total server-side for order confirmation emails.\n• booking-mobile — the checkout screen calls booking-api's quote endpoint and displays the same total.\n\nTests to run: pricing unit tests, checkout integration tests, and the booking-api quote endpoint tests. booking-mobile has no test covering the promo + tax case at all.",
  },
  {
    delayMs: 1300,
    content:
      "Filling the gaps I found…\n● Write(src/lib/pricing.test.ts) — booking-website\n● Write(../booking-api/tests/checkout-quote.test.ts) — booking-api\n● Write(../booking-mobile/tests/checkout-total.spec.ts) — booking-mobile",
  },
  {
    delayMs: 1300,
    content:
      "Running the affected suites…\n\nPASS  src/lib/pricing.test.ts (booking-website)\n  ✓ applies tax after the discount when a promo code is used\nPASS  tests/checkout-quote.test.ts (booking-api)\n  ✓ POST /checkout/quote returns tax computed after the discount\nPASS  tests/checkout-total.spec.ts (booking-mobile)\n  ✓ checkout screen shows the same total as the quote endpoint\n\nTest Suites: 3 passed, 3 total\nTests:       3 passed, 3 total",
  },
  {
    delayMs: 900,
    content:
      "That closes the gaps across all three repos. Here's what's ready for your review before committing:",
    review: {
      summary:
        "Filled cross-repo test gaps uncovered by the checkout total change — booking-website, booking-api, and booking-mobile all now cover the promo-code + tax path.",
      files: [
        {
          path: "src/lib/pricing.test.ts",
          description: "booking-website — unit test for tax computed after the discount.",
        },
        {
          path: "../booking-api/tests/checkout-quote.test.ts",
          description: "booking-api — integration test for the /checkout/quote endpoint's total.",
        },
        {
          path: "../booking-mobile/tests/checkout-total.spec.ts",
          description: "booking-mobile — frontend test asserting the checkout screen matches the quote total.",
        },
      ],
      commitMessage: "test: cover promo-code tax impact across booking-website, booking-api, booking-mobile",
    },
  },
];
