import type { IdeScriptedStep } from "@/lib/ide/types";

export const dependencyTestFollowupSteps: IdeScriptedStep[] = [
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
      "That closes the gaps across all three repos. I can commit directly here in booking-website — but booking-api and booking-mobile are owned by other teams, so I'll open PRs there for their review instead:",
    review: {
      summary:
        "Filled cross-repo test gaps uncovered by the checkout total change — booking-website, booking-api, and booking-mobile all now cover the promo-code + tax path.",
      files: [
        {
          path: "src/lib/pricing.test.ts",
          description: "booking-website — unit test for tax computed after the discount.",
          repo: "ordino-labs/booking-website",
        },
        {
          path: "../booking-api/tests/checkout-quote.test.ts",
          description: "booking-api — integration test for the /checkout/quote endpoint's total.",
          repo: "ordino-labs/booking-api",
        },
        {
          path: "../booking-mobile/tests/checkout-total.spec.ts",
          description: "booking-mobile — frontend test asserting the checkout screen matches the quote total.",
          repo: "ordino-labs/booking-mobile",
        },
      ],
      commitMessagesByRepo: {
        "ordino-labs/booking-website": "test: cover promo-code tax impact after discount",
        "ordino-labs/booking-api": "test: cover /checkout/quote promo-code tax impact",
        "ordino-labs/booking-mobile": "test: cover checkout total match with quote endpoint",
      },
      slackNotificationsByRepo: {
        "ordino-labs/booking-api":
          "Opened a PR against booking-api: tests/checkout-quote.test.ts. booking-website just fixed a bug where the promo-code discount was applied after tax instead of before — POST /checkout/quote had the same ordering bug, so its computed total silently diverged from what checkout now shows. The PR adds a regression test asserting the quote endpoint applies tax after the discount. No production code changed on your side; flagging in case anything else depends on the old ordering.",
        "ordino-labs/booking-mobile":
          "Opened a PR against booking-mobile: tests/checkout-total.spec.ts. This follows a fix in booking-website where the promo-code discount was applied after tax instead of before, which also affects the total booking-api's /checkout/quote returns. The checkout screen renders that total directly, so it was at risk of showing a mismatched total with no test catching it. The PR adds a test asserting the checkout screen matches the quote endpoint's total — no app code changed, just closing the coverage gap.",
      },
    },
  },
];

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
  ...dependencyTestFollowupSteps,
];

export const proactiveDependencyWarningSteps: IdeScriptedStep[] = [
  {
    delayMs: 700,
    content:
      "The pricing change just landed in booking-website — checking what depends on it across your repos: booking-api, booking-mobile…",
    proactive: true,
  },
  {
    delayMs: 1500,
    content:
      "Heads up — this change isn't fully handled downstream yet.\n\nImpact analysis for the calculateTotal() change in src/lib/pricing.ts:\n• booking-website — src/components/checkout/order-summary.tsx renders the total directly; e2e checkout flow depends on it.\n• booking-api — POST /checkout/quote recomputes the same total server-side for order confirmation emails.\n• booking-mobile — the checkout screen calls booking-api's quote endpoint and displays the same total.\n\nTests to run: pricing unit tests, checkout integration tests, and the booking-api quote endpoint tests. booking-mobile has no test covering the promo + tax case at all.",
    proactive: true,
    offer: {
      label: "Write the missing tests",
      followup: dependencyTestFollowupSteps,
    },
  },
];
