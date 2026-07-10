export const bugFixture = {
  filePath: "src/lib/pricing.ts",
  before: "  const tax = subtotal * TAX_RATE;",
  after: "  const tax = (subtotal - discount) * TAX_RATE;",
  explanation:
    "calculateTotal() in src/lib/pricing.ts computes sales tax on the full subtotal before the promo discount is subtracted, so any order with a promo code applied overpays tax.",
  prompt:
    "In src/lib/pricing.ts, update calculateTotal() so sales tax is computed on (subtotal - discount) instead of subtotal, so promo codes correctly reduce the taxable amount. Add a regression test in a new pricing.test.ts covering an order with a promo code applied. Don't change the promo code validation logic in promotions.ts.",
};
