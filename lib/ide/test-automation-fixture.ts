import type { IdeScriptedStep } from "@/lib/ide/types";

export const testAutomationSteps: IdeScriptedStep[] = [
  {
    delayMs: 700,
    content:
      "Got it — checking what's covered for the checkout total fix before we call it done. Scanning unit and integration test suites for src/lib/pricing.ts and src/components/checkout/order-summary.tsx…",
  },
  {
    delayMs: 1400,
    content:
      "Coverage results:\n• Unit — src/lib/pricing.ts: 62% lines covered. calculateTotal() has no case for a promo code combined with tax, which is exactly the path that was just fixed.\n• Integration — checkout flow: 40% covered. Multi-item cart with a promo code applied isn't exercised anywhere.\n• Frontend — src/components/checkout/order-summary.tsx has no automated coverage at all; the discount line only gets checked manually.\n\nI'll generate the missing tests and run them locally.",
  },
  {
    delayMs: 1300,
    content:
      "Generating tests…\n● Write(src/lib/pricing.test.ts)\n● Write(src/components/checkout/order-summary.test.tsx)\n● Write(e2e/checkout-promo-tax.spec.ts)",
  },
  {
    delayMs: 1300,
    content:
      "Running tests locally…\n\nPASS  src/lib/pricing.test.ts\n  calculateTotal\n    ✓ applies tax to the full subtotal with no promo code\n    ✓ applies tax after the discount when a promo code is used\nPASS  src/components/checkout/order-summary.test.tsx\n  OrderSummary\n    ✓ renders the discounted total with tax computed after the discount\nPASS  e2e/checkout-promo-tax.spec.ts\n  checkout · promo + tax\n    ✓ shows the correct total for a multi-item cart with a promo code\n\nTest Suites: 3 passed, 3 total\nTests:       4 passed, 4 total",
  },
  {
    delayMs: 900,
    content: "All green locally. Here's what's ready for your review before committing:",
    review: {
      summary:
        "Added regression coverage for the promo-code + tax fix across unit, integration, and frontend layers.",
      files: [
        {
          path: "src/lib/pricing.test.ts",
          description: "Unit tests for calculateTotal() covering tax with and without a promo code.",
          repo: "ordino-labs/booking-website",
        },
        {
          path: "src/components/checkout/order-summary.test.tsx",
          description: "Component test asserting the rendered total matches the post-discount tax.",
          repo: "ordino-labs/booking-website",
        },
        {
          path: "e2e/checkout-promo-tax.spec.ts",
          description: "New end-to-end test for a multi-item cart checkout with a promo code applied.",
          repo: "ordino-labs/booking-website",
        },
      ],
      commitMessagesByRepo: {
        "ordino-labs/booking-website": "test: add regression coverage for promo-code tax calculation",
      },
    },
  },
];
