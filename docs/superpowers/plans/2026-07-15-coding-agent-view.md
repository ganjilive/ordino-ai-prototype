# Coding Agent View Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 4th product-surface demo (`/agent`, "Coding Agent" card on `/`) that shows a scripted Claude-Code-style terminal session calling out to Ordino as a tool, twice, mid-task, visually distinguished with Ordino's real brand gradient.

**Architecture:** A self-contained script (`lib/agent/`) drives a single client component (`components/agent/coding-agent-view.tsx`) that reveals steps on a staggered `setTimeout` loop — the same pattern already used by `components/ide/terminal-panel.tsx` and `components/terminal/terminal-companion-view.tsx`. The two "Ordino call" steps render as one gradient-ringed box using the existing `.ordino-gradient-ring`/`.ordino-gradient-text`/`.ordino-gradient-bg` utility classes (`app/globals.css`), distinct from Claude Code's own amber tool-call lines.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, lucide-react.

## Global Constraints

- No test runner in this repo — verification is `npx tsc --noEmit` + `npm run lint` + manual/Playwright browser check, per established repo convention.
- No `setState` synchronously inside a `useEffect` body — schedule inside the `setTimeout` callback only (avoids the `react-hooks/set-state-in-effect` lint error hit earlier this session in `terminal-companion-view.tsx`).
- No impure calls (e.g. `Date.now()`) reachable during render (`react-hooks/purity`).
- `lib/agent/` and `components/agent/` must not import from `app/ide`, `app/terminal`, or their `lib`/`components` subtrees — this view must stay independently demoable, same as the other 3.
- Narrative numbers must stay internally consistent: subtotal 100, discount 20 (promo code `SAVE20`), tax rate 8% → tax ≈ 6.4, total $86.40. Every step referencing these numbers must use these exact values.

---

### Task 1: Script data (`lib/agent/`)

**Files:**
- Create: `lib/agent/types.ts`
- Create: `lib/agent/agent-script.ts`

**Interfaces:**
- Produces: `AgentStepKind` (union type), `AgentDiff`, `AgentStep` (from `types.ts`); `agentScript: AgentStep[]` (from `agent-script.ts`) — consumed by Task 2's view component.

- [ ] **Step 1: Create `lib/agent/types.ts`**

```ts
export type AgentStepKind =
  | "tool"
  | "result"
  | "text"
  | "diff"
  | "success"
  | "ordino-call"
  | "ordino-result";

export interface AgentDiff {
  filePath: string;
  before: string;
  after: string;
}

export interface AgentStep {
  id: string;
  kind: AgentStepKind;
  delayMs: number;
  text?: string;
  diff?: AgentDiff;
}
```

- [ ] **Step 2: Create `lib/agent/agent-script.ts`**

```ts
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
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/agent/types.ts lib/agent/agent-script.ts
git commit -m "$(cat <<'EOF'
Add Coding Agent view script data

Self-contained narrative for the new /agent demo — no imports from
app/ide or app/terminal, per the independence requirement in
docs/superpowers/specs/2026-07-15-coding-agent-view-design.md.
EOF
)"
```

---

### Task 2: View component + routing (`/agent`)

**Files:**
- Create: `app/agent/layout.tsx`
- Create: `app/agent/page.tsx`
- Create: `components/agent/coding-agent-view.tsx`

**Interfaces:**
- Consumes: `AgentStep`, `AgentDiff` (`@/lib/agent/types`), `agentScript` (`@/lib/agent/agent-script`) — from Task 1.
- Produces: `CodingAgentView` component — consumed by `app/agent/page.tsx` in this task, and referenced (as a route, not an import) by Task 3's home page card.

- [ ] **Step 1: Create `app/agent/layout.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordino — Coding Agent",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Create `app/agent/page.tsx`**

```tsx
import { CodingAgentView } from "@/components/agent/coding-agent-view";

export default function AgentPage() {
  return <CodingAgentView />;
}
```

- [ ] **Step 3: Create `components/agent/coding-agent-view.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";

import { agentScript } from "@/lib/agent/agent-script";
import type { AgentDiff, AgentStep } from "@/lib/agent/types";

function DiffBlock({ diff }: { diff: AgentDiff }) {
  return (
    <div className="my-2 ml-6 rounded border border-white/10 bg-black/30">
      <div className="border-b border-white/10 px-2 py-1 text-[12px] text-[#9da5b4]">
        {diff.filePath}
      </div>
      <div className="px-2 py-1">
        <div className="flex gap-2 text-[#f47067]">
          <span>-</span>
          <span>{diff.before.trim()}</span>
        </div>
        <div className="flex gap-2 text-[#7ee787]">
          <span>+</span>
          <span className="whitespace-pre-wrap">{diff.after.trim()}</span>
        </div>
      </div>
    </div>
  );
}

function OrdinoBox({ call, result }: { call: AgentStep; result: AgentStep | null }) {
  return (
    <div className="ordino-gradient-ring my-2 rounded-lg p-[1.5px]">
      <div className="rounded-[7px] bg-[#1e1e1e] p-3">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide">
          <span className="ordino-gradient-text">Ordino</span>
          <span className="normal-case tracking-normal text-[#6b6b6b]">{call.text}</span>
        </div>
        {result ? (
          <div className="mt-1 text-[#cccccc]">{result.text}</div>
        ) : (
          <div className="mt-1 flex items-center gap-2 text-[#9da5b4]">
            <span className="ordino-gradient-bg h-1.5 w-1.5 animate-pulse rounded-full" />
            Ordino is checking…
          </div>
        )}
      </div>
    </div>
  );
}

function AgentStepView({ step }: { step: AgentStep }) {
  switch (step.kind) {
    case "tool":
      return (
        <div className="flex gap-2 pt-2">
          <span className="text-[#e5c07b]">●</span>
          <span className="text-white">{step.text}</span>
        </div>
      );
    case "result":
      return (
        <div className="flex gap-2 pl-6 text-[#6b6b6b]">
          <span>⎿</span>
          <span>{step.text}</span>
        </div>
      );
    case "text":
      return <div className="pt-2 text-[#cccccc]">{step.text}</div>;
    case "success":
      return (
        <div className="flex gap-2 pt-2 font-medium text-[#89d185]">
          <span>✔</span>
          <span>{step.text}</span>
        </div>
      );
    case "diff":
      return step.diff ? <DiffBlock diff={step.diff} /> : null;
    default:
      return null;
  }
}

function renderRevealed(steps: AgentStep[]) {
  const nodes: React.ReactNode[] = [];
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (step.kind === "ordino-call") {
      const next = steps[i + 1];
      const result = next?.kind === "ordino-result" ? next : null;
      nodes.push(<OrdinoBox key={step.id} call={step} result={result} />);
      if (result) i += 1;
      continue;
    }
    nodes.push(<AgentStepView key={step.id} step={step} />);
  }
  return nodes;
}

export function CodingAgentView() {
  const [inputValue, setInputValue] = useState("");
  const [submittedInput, setSubmittedInput] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasStarted) return;
    let cancelled = false;
    let index = 0;

    function scheduleNext() {
      if (cancelled || index >= agentScript.length) return;
      const step = agentScript[index];
      window.setTimeout(() => {
        if (cancelled) return;
        index += 1;
        setRevealedCount(index);
        scheduleNext();
      }, step.delayMs);
    }

    scheduleNext();
    return () => {
      cancelled = true;
    };
  }, [hasStarted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [revealedCount, hasStarted]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (hasStarted) return;
    setSubmittedInput(
      inputValue.trim() || "Add tests for the promo-code + tax path in calculateTotal",
    );
    setInputValue("");
    setHasStarted(true);
  }

  const finished = hasStarted && revealedCount >= agentScript.length;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Ordino
        </Link>
        <span className="text-muted-foreground">/</span>
        <Bot className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Coding Agent</span>
        <span className="ml-auto text-xs text-muted-foreground">booking-website</span>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto bg-[#1e1e1e] p-3 font-mono text-[13px] leading-[20px] text-[#cccccc]"
      >
        {hasStarted && submittedInput && (
          <div className="flex gap-2">
            <span className="text-[#4ec9b0]">{">"}</span>
            <span>{submittedInput}</span>
          </div>
        )}

        {renderRevealed(agentScript.slice(0, revealedCount))}

        {hasStarted && !finished && (
          <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#4ec9b0]" />
            Claude Code is running…
          </div>
        )}

        {!hasStarted && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-[#4ec9b0]">{">"}</span>
            <input
              autoFocus
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              className="flex-1 bg-transparent outline-none placeholder:text-[#5a5a5a]"
              placeholder="Add tests for the promo-code + tax path in calculateTotal"
            />
          </form>
        )}

        {finished && (
          <div className="flex items-center gap-2 pt-2 text-[#4ec9b0]">
            <span>{">"}</span>
            <span className="animate-pulse">▍</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 5: Manual browser check**

With the dev server running (`npm run dev`), visit `http://localhost:3000/agent` directly:
- Confirm the shell prompt shows with the placeholder text.
- Type anything and press Enter — confirm the script plays through step by step (tool calls, diffs, the two gradient-ringed Ordino boxes, the final green success line).
- Confirm the "← Ordino" link returns to `/`.

- [ ] **Step 6: Commit**

```bash
git add app/agent/layout.tsx app/agent/page.tsx components/agent/coding-agent-view.tsx
git commit -m "$(cat <<'EOF'
Add /agent route: Coding Agent view

Scripted Claude-Code-style terminal session that calls Ordino as a
tool twice mid-task, rendered in a gradient-ringed box distinct from
Claude Code's own tool-call lines, per
docs/superpowers/specs/2026-07-15-coding-agent-view-design.md.
EOF
)"
```

---

### Task 3: Home page card

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `ProductSurfaceCard` (`@/components/home/product-surface-card`, unchanged, already generic) — routes to `/agent` from Task 2.

- [ ] **Step 1: Add the `Bot` icon import and the 4th surface entry**

Replace the full contents of `app/page.tsx` with:

```tsx
import { Bot, Code2, Monitor, SquareTerminal } from "lucide-react";

import { ProductSurfaceCard } from "@/components/home/product-surface-card";

const PRODUCT_SURFACES = [
  {
    href: "/chat",
    icon: Monitor,
    title: "Desktop App",
    description:
      "The full Ordino workspace — projects, chat, integrations, and quality dashboards in one dashboard shell.",
    cta: "Open desktop app",
  },
  {
    href: "/ide",
    icon: Code2,
    title: "VS Code Extension",
    description:
      "Ordino embedded in the editor — investigates a bug, hands off a fix prompt, and verifies the flows it touches before a PR opens.",
    cta: "Open VS Code extension",
  },
  {
    href: "/terminal",
    icon: SquareTerminal,
    title: "Terminal",
    description:
      "Ordino Terminal Companion — watches your repo, runs local checks, and proactively flags cross-repo risk while you work.",
    cta: "Open terminal",
  },
  {
    href: "/agent",
    icon: Bot,
    title: "Coding Agent",
    description:
      "Claude Code working a task, calling out to Ordino mid-flight to check cross-repo impact before it finishes.",
    cta: "Open coding agent demo",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Ordino</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Four product-surface ideas for the same concept. Pick one to demo.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_SURFACES.map((surface) => (
          <ProductSurfaceCard key={surface.href} {...surface} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual browser check**

Visit `http://localhost:3000/` — confirm 4 cards render (2x2 on medium width, 4-across on wide), and clicking "Coding Agent" navigates to `/agent`.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
Add Coding Agent card to home page

4th product-surface entry pointing at /agent, alongside Desktop App,
VS Code Extension, and Terminal.
EOF
)"
```

---

### Task 4: Full regression check

**Files:**
- Create (scratchpad, not committed): a Playwright verification script in the session scratchpad directory.

**Interfaces:**
- Consumes: the running dev server at `http://localhost:3000` (all routes from Tasks 1-3, plus the pre-existing `/chat`, `/ide`, `/terminal`).

- [ ] **Step 1: Write the verification script**

Save to the scratchpad directory (e.g. `verify-coding-agent.mjs`):

```js
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on("console", (msg) => {
  if (msg.type() === "error") logs.push(`console.error: ${msg.text()}`);
});
page.on("pageerror", (err) => logs.push(`pageerror: ${err.message}`));

async function step(name, fn) {
  try {
    await fn();
    console.log(`OK   ${name}`);
  } catch (err) {
    console.log(`FAIL ${name}: ${err.message}`);
  }
}

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });

await step("home page shows 4 cards", async () => {
  await page.locator("text=Coding Agent").waitFor({ timeout: 3000 });
  await page.locator("text=Desktop App").waitFor({ timeout: 1000 });
  await page.locator("text=VS Code Extension").waitFor({ timeout: 1000 });
  await page.locator("text=Terminal").waitFor({ timeout: 1000 });
});

await step("Coding Agent card navigates to /agent", async () => {
  await page.locator("a", { hasText: "Open coding agent demo" }).click();
  await page.waitForURL("http://localhost:3000/agent");
});

await step("shell prompt shown before launch", async () => {
  await page.locator('input[placeholder*="promo-code"]').waitFor({ timeout: 3000 });
});

await step("typing a task plays the script", async () => {
  await page.locator('input[placeholder*="promo-code"]').fill("add tests");
  await page.locator('input[placeholder*="promo-code"]').press("Enter");
  await page.locator("text=Read(src/lib/pricing.ts)").waitFor({ timeout: 3000 });
});

await step("first Ordino call renders in a gradient box", async () => {
  await page.locator(".ordino-gradient-ring", { hasText: "Ordino" }).first().waitFor({ timeout: 8000 });
  await page
    .locator("text=calculateTotal() is also called from ../booking-api/src/quote.ts")
    .waitFor({ timeout: 3000 });
});

await step("second Ordino call confirms all clear", async () => {
  await page.locator("text=All flows covered. No cross-repo gaps.").waitFor({ timeout: 10000 });
});

await step("final success line appears", async () => {
  await page
    .locator("text=including the previously-untested booking-api contract")
    .waitFor({ timeout: 5000 });
});

await step("back link returns to /", async () => {
  await page.locator("a", { hasText: "Ordino" }).first().click();
  await page.waitForURL("http://localhost:3000/");
});

await step("other 3 views still reachable", async () => {
  for (const [label, url] of [
    ["Desktop App", "http://localhost:3000/chat"],
    ["VS Code Extension", "http://localhost:3000/ide"],
    ["Terminal", "http://localhost:3000/terminal"],
  ]) {
    await page.goto(url, { waitUntil: "networkidle" });
    if (page.url() !== url) throw new Error(`${label} did not stay on ${url}`);
  }
});

console.log("\n--- console/page errors captured ---");
console.log(logs.length ? logs.join("\n") : "(none)");

await browser.close();
```

- [ ] **Step 2: Run it**

Run: `node verify-coding-agent.mjs` (from the scratchpad directory where Playwright is already installed locally this session)
Expected: every `step()` prints `OK`, and the console/page error list is `(none)`.

No commit for this task — it's a verification script only, not part of the repo.
