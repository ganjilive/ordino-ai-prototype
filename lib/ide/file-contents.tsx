import type { CodeLine, CodeToken } from "@/lib/ide/types";

function pl(text: string): CodeToken {
  return { text };
}
function kw(text: string): CodeToken {
  return { text, kind: "keyword" };
}
function str(text: string): CodeToken {
  return { text, kind: "string" };
}
function cmt(text: string): CodeToken {
  return { text, kind: "comment" };
}
function typ(text: string): CodeToken {
  return { text, kind: "type" };
}
function fn(text: string): CodeToken {
  return { text, kind: "function" };
}
function num(text: string): CodeToken {
  return { text, kind: "number" };
}

const pricingTs: CodeLine[] = [
  [kw("import"), pl(" { "), fn("getPromotion"), pl(" } "), kw("from"), pl(" "), str('"./promotions"'), pl(";")],
  [],
  [kw("const"), pl(" "), typ("TAX_RATE"), pl(" = "), num("0.08"), pl(";")],
  [],
  [kw("export"), pl(" "), kw("interface"), pl(" "), typ("PricingBreakdown"), pl(" {")],
  [pl("  subtotal: "), typ("number"), pl(";")],
  [pl("  discount: "), typ("number"), pl(";")],
  [pl("  tax: "), typ("number"), pl(";")],
  [pl("  total: "), typ("number"), pl(";")],
  [pl("}")],
  [],
  [kw("export"), pl(" "), kw("function"), pl(" "), fn("calculateTotal"), pl("(")],
  [pl("  subtotal: "), typ("number"), pl(",")],
  [pl("  promoCode?: "), typ("string"), pl(",")],
  [pl("): "), typ("PricingBreakdown"), pl(" {")],
  [
    pl("  "),
    kw("const"),
    pl(" promotion = promoCode ? "),
    fn("getPromotion"),
    pl("(promoCode) : "),
    kw("undefined"),
    pl(";"),
  ],
  [
    pl("  "),
    kw("const"),
    pl(" discount = promotion ? subtotal * promotion.percentOff : "),
    num("0"),
    pl(";"),
  ],
  [],
  [pl("  "), cmt("// Sales tax is calculated on the full subtotal, before any discount is applied.")],
  [pl("  "), kw("const"), pl(" tax = subtotal * "), typ("TAX_RATE"), pl(";")],
  [],
  [pl("  "), kw("const"), pl(" total = subtotal - discount + tax;")],
  [],
  [pl("  "), kw("return"), pl(" { subtotal, discount, tax, total };")],
  [pl("}")],
];

const promotionsTs: CodeLine[] = [
  [kw("export"), pl(" "), kw("interface"), pl(" "), typ("Promotion"), pl(" {")],
  [pl("  code: "), typ("string"), pl(";")],
  [pl("  percentOff: "), typ("number"), pl(";")],
  [pl("  description: "), typ("string"), pl(";")],
  [pl("}")],
  [],
  [kw("const"), pl(" "), typ("PROMOTIONS"), pl(": "), typ("Promotion"), pl("[] = [")],
  [
    pl("  { code: "),
    str('"WELCOME10"'),
    pl(", percentOff: "),
    num("0.1"),
    pl(", description: "),
    str('"10% off for new customers"'),
    pl(" },"),
  ],
  [
    pl("  { code: "),
    str('"SUMMER20"'),
    pl(", percentOff: "),
    num("0.2"),
    pl(", description: "),
    str('"20% off summer sale"'),
    pl(" },"),
  ],
  [pl("];")],
  [],
  [
    kw("export"),
    pl(" "),
    kw("function"),
    pl(" "),
    fn("getPromotion"),
    pl("(code: "),
    typ("string"),
    pl("): "),
    typ("Promotion"),
    pl(" | "),
    kw("undefined"),
    pl(" {"),
  ],
  [pl("  "), kw("return"), pl(" PROMOTIONS.find((p) => p.code.toLowerCase() === code.toLowerCase());")],
  [pl("}")],
];

const orderSummaryTsx: CodeLine[] = [
  [kw("import"), pl(" { "), fn("calculateTotal"), pl(" } "), kw("from"), pl(" "), str('"@/lib/pricing"'), pl(";")],
  [],
  [kw("interface"), pl(" "), typ("OrderSummaryProps"), pl(" {")],
  [pl("  subtotal: "), typ("number"), pl(";")],
  [pl("  promoCode?: "), typ("string"), pl(";")],
  [pl("}")],
  [],
  [
    kw("export"),
    pl(" "),
    kw("function"),
    pl(" "),
    fn("OrderSummary"),
    pl("({ subtotal, promoCode }: "),
    typ("OrderSummaryProps"),
    pl(") {"),
  ],
  [pl("  "), kw("const"), pl(" { discount, tax, total } = "), fn("calculateTotal"), pl("(subtotal, promoCode);")],
  [],
  [pl("  "), kw("return"), pl(" (")],
  [pl("    <div className="), str('"order-summary"'), pl(">")],
  [pl("      <Row label="), str('"Subtotal"'), pl(" value={subtotal} />")],
  [pl("      {discount > "), num("0"), pl(" && <Row label="), str('"Discount"'), pl(" value={-discount} />}")],
  [pl("      <Row label="), str('"Tax"'), pl(" value={tax} />")],
  [pl("      <Row label="), str('"Total"'), pl(" value={total} emphasis />")],
  [pl("    </div>")],
  [pl("  );")],
  [pl("}")],
];

const promoCodeInputTsx: CodeLine[] = [
  [kw("import"), pl(" { useState } "), kw("from"), pl(" "), str('"react"'), pl(";")],
  [],
  [kw("interface"), pl(" "), typ("PromoCodeInputProps"), pl(" {")],
  [pl("  onApply: (code: "), typ("string"), pl(") => "), kw("void"), pl(";")],
  [pl("}")],
  [],
  [
    kw("export"),
    pl(" "),
    kw("function"),
    pl(" "),
    fn("PromoCodeInput"),
    pl("({ onApply }: "),
    typ("PromoCodeInputProps"),
    pl(") {"),
  ],
  [pl("  "), kw("const"), pl(" [code, setCode] = "), fn("useState"), pl('("");')],
  [],
  [pl("  "), kw("return"), pl(" (")],
  [pl("    <form onSubmit={(e) => { e.preventDefault(); onApply(code); }}>")],
  [pl("      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="), str('"Promo code"'), pl(" />")],
  [pl("      <button type="), str('"submit"'), pl(">Apply</button>")],
  [pl("    </form>")],
  [pl("  );")],
  [pl("}")],
];

const fileContents: Record<string, CodeLine[]> = {
  "src/lib/pricing.ts": pricingTs,
  "src/lib/promotions.ts": promotionsTs,
  "src/components/checkout/order-summary.tsx": orderSummaryTsx,
  "src/components/checkout/promo-code-input.tsx": promoCodeInputTsx,
};

function genericPlaceholder(path: string): CodeLine[] {
  return [
    [cmt(`// ${path}`)],
    [],
    [pl("// This file isn't part of this walkthrough — nothing to see here yet.")],
  ];
}

export function getFileLines(path: string): CodeLine[] {
  return fileContents[path] ?? genericPlaceholder(path);
}
