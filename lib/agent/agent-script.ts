import type { AgentStep } from "@/lib/agent/types";

export const agentScript: AgentStep[] = [
  { id: "step-1", kind: "tool", delayMs: 400, text: "Read(src/lib/pricing.ts)" },
  { id: "step-2", kind: "result", delayMs: 350, text: "Read 25 lines" },
  { id: "step-3", kind: "tool", delayMs: 450, text: "Read(src/lib/pricing.test.ts)" },
  { id: "step-4", kind: "result", delayMs: 350, text: "Read 40 lines" },
  {
    id: "step-5",
    kind: "text",
    delayMs: 700,
    text: "I'll add unit, integration, and e2e coverage for the promo-code + tax path in calculateTotal.",
  },
  { id: "step-6", kind: "tool", delayMs: 500, text: "Edit(src/lib/pricing.test.ts)" },
  {
    id: "step-7",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: "src/lib/pricing.test.ts",
      before: "  // no coverage for promo code + tax interaction",
      after:
        'it("applies tax after the discount when a promo code is used", () => {\n    const result = calculateTotal({ subtotal: 100, discount: 20, promoCode: "SAVE20" });\n    expect(result.tax).toBeCloseTo(6.4);\n  });',
    },
  },
  { id: "step-8", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-9", kind: "tool", delayMs: 500, text: "Edit(src/lib/checkout.integration.test.ts)" },
  {
    id: "step-10",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: "src/lib/checkout.integration.test.ts",
      before: "  // checkout flow with promo code not covered",
      after:
        'it("checks out with a promo code and shows the discounted, correctly-taxed total", async () => {\n    const total = await checkout({ cart, promoCode: "SAVE20" });\n    expect(total.tax).toBeCloseTo(6.4);\n  });',
    },
  },
  { id: "step-11", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-12", kind: "tool", delayMs: 600, text: "Bash(npm test -- pricing)" },
  { id: "step-13", kind: "result", delayMs: 500, text: "8 passed, 0 failed" },
  { id: "step-14", kind: "tool", delayMs: 500, text: "Edit(e2e/booking-flow.e2e.spec.ts)" },
  {
    id: "step-15",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: "e2e/booking-flow.e2e.spec.ts",
      before: "  // no e2e coverage for promo code checkout",
      after:
        'test("promo code checkout shows the correct discounted total", async ({ page }) => {\n    await applyPromoCode(page, "SAVE20");\n    await expect(page.getByTestId("order-total")).toHaveText("$86.40");\n  });',
    },
  },
  { id: "step-16", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-17", kind: "ordino-call", delayMs: 600, text: "Ordino(check-cross-repo-impact)" },
  {
    id: "step-18",
    kind: "ordino-result",
    delayMs: 900,
    text: "calculateTotal() is also called from ../booking-api/src/quote.ts (POST /checkout/quote) — no test covers the promo-code + tax path there.",
  },
  {
    id: "step-19",
    kind: "text",
    delayMs: 700,
    text: "Good catch — booking-api depends on this function too but doesn't test that path. I'll close that gap before finishing.",
  },
  { id: "step-20", kind: "tool", delayMs: 450, text: "Read(../booking-api/src/quote.ts)" },
  { id: "step-21", kind: "result", delayMs: 350, text: "Read 32 lines" },
  { id: "step-22", kind: "tool", delayMs: 500, text: "Edit(../booking-api/test/quote.test.ts)" },
  {
    id: "step-23",
    kind: "diff",
    delayMs: 450,
    diff: {
      filePath: "../booking-api/test/quote.test.ts",
      before: "  // no coverage for promo code + tax on the quote endpoint",
      after:
        'it("POST /checkout/quote applies tax after the discount when a promo code is used", async () => {\n    const res = await postQuote({ subtotal: 100, discount: 20, promoCode: "SAVE20" });\n    expect(res.body.tax).toBeCloseTo(6.4);\n  });',
    },
  },
  { id: "step-24", kind: "result", delayMs: 350, text: "Updated 1 line" },
  { id: "step-25", kind: "tool", delayMs: 600, text: "Bash(npm test)" },
  { id: "step-26", kind: "result", delayMs: 500, text: "12 passed, 0 failed" },
  { id: "step-27", kind: "ordino-call", delayMs: 600, text: "Ordino(check-cross-repo-impact)" },
  {
    id: "step-28",
    kind: "ordino-result",
    delayMs: 800,
    text: "✓ All flows covered. No cross-repo gaps.",
  },
  {
    id: "step-29",
    kind: "success",
    delayMs: 400,
    text: "Done — added unit, integration, and e2e coverage for the promo-code + tax path, including the previously-untested booking-api contract.",
  },
];
