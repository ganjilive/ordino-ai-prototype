# Marketing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new in-app marketing page (`/marketing`, "View Marketing Page" button on `/`) that pitches Ordino as "QA for the agentic era" in a What/Why/How structure, built in the product's own dark theme rather than the cream-styled static docs.

**Architecture:** A single server-component page (`app/marketing/page.tsx`) lays out five sections using the product's existing design tokens and shadcn primitives. Two small components carry the only interactive/reusable pieces: `WaitlistForm` (client component, local state only, no network calls, rendered twice) and `RiskNotificationMockup` (static, presentational).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind CSS v4, lucide-react, shadcn/base-ui primitives (`Button`, `Input`, `Badge`).

## Global Constraints

- No test runner in this repo — verification is `npx tsc --noEmit` + `npm run lint` + manual/Playwright browser check, per established repo convention.
- No new npm dependencies — build entirely from `components/ui/*` (Button, Input, Badge) and existing `app/globals.css` utilities (`.ordino-gradient-text`, `.ordino-gradient-ring`, `.ordino-gradient-bg`).
- The waitlist form must never call `fetch`/persist data — submit only flips local component state to a confirmation message, per the spec's Non-goals.
- The "Why" section must stay centered on the **quality owner** (QA engineer, tech lead, release manager) signing off on a merge/release — not the developer's commit-time workflow. Exact copy is specified per-step below; do not substitute developer-voiced phrasing.
- `/marketing` is a real in-app route linked with a plain Next `Link`/`<a href>` (no `target="_blank"`), unlike the two existing static-doc buttons on `/` which open in a new tab.

---

### Task 1: Waitlist form component

**Files:**
- Create: `components/marketing/waitlist-form.tsx`

**Interfaces:**
- Produces: `WaitlistForm` component (no props) — consumed by Task 3's page (hero + closing CTA, two independent instances).

- [ ] **Step 1: Create `components/marketing/waitlist-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  if (status === "submitted") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckCircle2 className="h-4 w-4 text-success" />
        You&apos;re on the list — we&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("submitted");
      }}
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
    >
      <Input
        type="email"
        required
        placeholder="you@company.com"
        aria-label="Email address"
        className="h-9"
      />
      <Button type="submit" size="lg">
        Join the waitlist
      </Button>
    </form>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/waitlist-form.tsx
git commit -m "$(cat <<'EOF'
Add WaitlistForm component for the marketing page

Decorative-only: submitting swaps to a confirmation state with no
network call or persistence, per
docs/superpowers/specs/2026-07-19-marketing-page-design.md.
EOF
)"
```

---

### Task 2: Risk notification mockup component

**Files:**
- Create: `components/marketing/risk-notification-mockup.tsx`

**Interfaces:**
- Produces: `RiskNotificationMockup` component (no props) — consumed by Task 3's "How" section.

- [ ] **Step 1: Create `components/marketing/risk-notification-mockup.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";

export function RiskNotificationMockup() {
  return (
    <div className="max-w-lg rounded-lg border border-border border-l-4 border-l-destructive bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          O
        </div>
        <span className="text-sm font-semibold">Ordino</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          APP
        </span>
        <span className="text-xs text-muted-foreground">10:42 AM</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        <span className="font-semibold">
          Risk flag — PR #482 &quot;Refactor payment gateway client&quot;
        </span>
        <br />
        This change touches shared code used by 3 other repos: checkout-service,
        notifications-service, billing-service. Test coverage for the affected
        functions is 41%.
      </p>
      <div className="mt-2">
        <Badge variant="destructive">High risk</Badge>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          View PR
        </span>
        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          View full report
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/marketing/risk-notification-mockup.tsx
git commit -m "$(cat <<'EOF'
Add RiskNotificationMockup component for the marketing page

Static recreation of the Slack risk-flag mockup from
public/design-brief.html, restyled with the app's own theme tokens
instead of the brief's inline cream/rust palette.
EOF
)"
```

---

### Task 3: Marketing page route

**Files:**
- Create: `app/marketing/layout.tsx`
- Create: `app/marketing/page.tsx`

**Interfaces:**
- Consumes: `WaitlistForm` (`@/components/marketing/waitlist-form`, Task 1), `RiskNotificationMockup` (`@/components/marketing/risk-notification-mockup`, Task 2).
- Produces: the `/marketing` route — linked (not imported) by Task 4's home page button.

- [ ] **Step 1: Create `app/marketing/layout.tsx`**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordino — QA for the Agentic Era",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Create `app/marketing/page.tsx`**

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RiskNotificationMockup } from "@/components/marketing/risk-notification-mockup";
import { WaitlistForm } from "@/components/marketing/waitlist-form";

const STATS = [
  {
    value: "7,839",
    label: "lines of code / developer / month",
    sub: "up 76% in a year",
  },
  {
    value: "85%+",
    label: "of enterprise QA teams",
    sub: "say AI code generation has outpaced their ability to test it",
  },
  {
    value: "+199.6%",
    label: "median PR review time",
    sub: "under high AI adoption",
  },
] as const;

const SURFACES = [
  {
    title: "Direct use",
    description: "Chat, terminal, or IDE panel — the quality owner's own workspace.",
  },
  {
    title: "Background watcher",
    description:
      "Runs alongside the repo, notifies through Slack or PR comments — no new interface to check.",
  },
  {
    title: "Called by other agents",
    description: "Claude Code, Cursor, or any MCP-capable agent invokes Ordino mid-task.",
  },
] as const;

const SUPPORTING_CAPABILITIES = [
  "Test Automation",
  "Root Cause Analysis",
  "Test Planning",
  "Auto Healing",
  "Requirement Analysis",
] as const;

export default function MarketingPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="ordino-gradient-ring pointer-events-none absolute top-[-220px] left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            QA for the agentic era
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your agents ship code fast. Is your QA keeping up?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Ordino is the always-on QA teammate for the agentic era — it sees across every
            repo your team owns, catches what a change breaks before the PR exists, and does
            the testing work your team already does, just faster.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* What */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          What is Ordino
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          QA, built for how software gets made now
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Ordino is an always-on quality partner for whoever owns product quality — a QA
          engineer, tech lead, or release manager. It connects to the repos, requirements,
          test-management, and communication tools already in use, and takes on the actual
          work of testing: planning it, writing it, running it, and explaining why it broke.
        </p>
      </section>

      {/* Why */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Why it matters
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            AI writes code faster than anyone can verify it
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-sm font-medium">{stat.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-base text-muted-foreground">
            For a quality owner accountable for a product built across many repos, that
            bottleneck isn&apos;t backlog — it&apos;s blind spots. A developer changes one
            piece, and nothing tells the quality owner what else it touches, until CI fails
            somewhere else — often after they&apos;ve already signed off.
          </p>

          <div className="mt-6 max-w-2xl rounded-lg border border-border border-l-4 border-l-primary bg-card p-5">
            <h3 className="text-sm font-semibold">Isn&apos;t this just integration testing?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Integration tests only catch what someone already thought to test. The blind
              spot isn&apos;t a missing test suite — it&apos;s not knowing a change reaches
              into another repo at all, until it&apos;s already merged. Ordino surfaces that
              reach before the PR exists, including paths nobody flagged for coverage in the
              first place.
            </p>
          </div>

          <blockquote className="mt-8 max-w-2xl border-l-2 border-border pl-5 text-lg text-foreground italic">
            &quot;Before I approve this, I want to know what it actually touches — and
            whether it&apos;s covered.&quot;
            <footer className="mt-2 text-sm font-normal text-muted-foreground not-italic">
              The same blind spot developer interviews confirmed, now from the seat that has
              to approve it.
            </footer>
          </blockquote>

          <p className="mt-6 max-w-2xl text-base font-medium">
            That&apos;s the moment nothing else catches. Ordino is built to catch it before
            sign-off.
          </p>
        </div>
      </section>

      {/* How */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          How it works
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          One QA teammate, wherever your team already works
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SURFACES.map((surface) => (
            <div key={surface.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">{surface.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{surface.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <RiskNotificationMockup />
          <p className="mt-2 text-xs text-muted-foreground italic">
            The background watcher in action — nobody asked, Ordino noticed.
          </p>
        </div>

        <div className="ordino-gradient-ring mt-10 max-w-2xl rounded-lg p-[1.5px]">
          <div className="rounded-[7px] bg-card p-6">
            <span className="ordino-gradient-text text-xs font-semibold tracking-wide uppercase">
              Blast radius analysis + test authoring
            </span>
            <p className="mt-2 text-base text-foreground">
              Ordino figures out exactly what a change puts at risk across every repo it
              touches, then writes the tests to cover it — before anyone has to ask.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SUPPORTING_CAPABILITIES.map((capability) => (
            <div
              key={capability}
              className="rounded-lg border border-border bg-card/60 p-3 text-center text-sm font-medium text-muted-foreground"
            >
              {capability}
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Be first to bring Ordino to your team
          </h2>
          <div className="mt-6 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Ordino
        </Link>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual browser check**

With the dev server running (`npm run dev`), visit `http://localhost:3000/marketing` directly:
- Confirm all five sections render in order: Hero, What, Why, How, Closing CTA.
- Confirm the stat strip shows 3 cards, the risk notification mockup renders with a "High risk" badge, and the gradient-bordered "Blast radius analysis + test authoring" callout is visually distinct from the plain capability grid below it.
- Type an email into the hero waitlist form and submit — confirm it swaps to "You're on the list — we'll be in touch." without a page reload.
- Scroll to the closing CTA form and submit it independently — confirm it also swaps to the confirmation state (and that submitting one form did not already flip the other).
- Confirm "← Back to Ordino" returns to `/`.
- Resize to a mobile width (e.g. 375px) and confirm the stat strip, surface cards, and capability grid reflow to a single/narrow column with no horizontal overflow.

- [ ] **Step 5: Commit**

```bash
git add app/marketing/layout.tsx app/marketing/page.tsx
git commit -m "$(cat <<'EOF'
Add /marketing route: Ordino marketing page

What/Why/How pitch page positioning Ordino as "QA for the agentic
era," built in the product's own dark theme rather than the cream
styling of the static research-findings/design-brief docs, per
docs/superpowers/specs/2026-07-19-marketing-page-design.md.
EOF
)"
```

---

### Task 4: Home page button

**Files:**
- Modify: `app/page.tsx` (lucide-react import line, and the button row inside the `<div className="flex items-center gap-2">` block)

**Interfaces:**
- Consumes: nothing new — links to the `/marketing` route created in Task 3 via `<a href>`, matching the existing pattern for the two doc buttons already in this file.

- [ ] **Step 1: Add the `Megaphone` icon import**

In `app/page.tsx`, change the lucide-react import line:

```tsx
import { Bot, Code2, FileText, FlaskConical, Megaphone, Monitor, SquareTerminal } from "lucide-react";
```

- [ ] **Step 2: Add the third button**

In `app/page.tsx`, inside the `<div className="flex items-center gap-2">` block that currently contains the "Research Findings" and "Read the Design Brief" `<a>` tags, add a third `<a>` immediately after them:

```tsx
          <a
            href="/marketing"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Megaphone className="h-4 w-4" />
            View Marketing Page
          </a>
```

Note: unlike the two existing buttons, this one has no `target="_blank"`/`rel="noopener noreferrer"` — `/marketing` is a real in-app route, not a static file to open in a new tab.

- [ ] **Step 3: Verify types and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual browser check**

Visit `http://localhost:3000/` — confirm a third button "View Marketing Page" appears after "Research Findings" and "Read the Design Brief," styled as an outline button distinct from the other two. Click it and confirm it navigates to `/marketing` in the same tab.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "$(cat <<'EOF'
Add "View Marketing Page" button to home page

Links to the new /marketing route in-app (no target=_blank, unlike
the two static-doc buttons it sits next to).
EOF
)"
```

---

### Task 5: Full regression check

**Files:**
- Create (scratchpad, not committed): a Playwright verification script in the session scratchpad directory.

**Interfaces:**
- Consumes: the running dev server at `http://localhost:3000` (all routes from Tasks 1-4, plus the pre-existing `/chat`, `/ide`, `/terminal`, `/agent`).

- [ ] **Step 1: Write the verification script**

Save to the scratchpad directory (e.g. `verify-marketing-page.mjs`):

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

await step("home page shows the marketing page button", async () => {
  await page.locator("text=View Marketing Page").waitFor({ timeout: 3000 });
});

await step("button navigates to /marketing", async () => {
  await page.locator("a", { hasText: "View Marketing Page" }).click();
  await page.waitForURL("http://localhost:3000/marketing");
});

await step("all five sections render", async () => {
  await page.locator("text=Your agents ship code fast").waitFor({ timeout: 3000 });
  await page.locator("text=QA, built for how software gets made now").waitFor({ timeout: 1000 });
  await page.locator("text=AI writes code faster than anyone can verify it").waitFor({ timeout: 1000 });
  await page.locator("text=One QA teammate, wherever your team already works").waitFor({ timeout: 1000 });
  await page.locator("text=Be first to bring Ordino to your team").waitFor({ timeout: 1000 });
});

await step("risk notification mockup and high-risk badge render", async () => {
  await page.locator("text=Refactor payment gateway client").waitFor({ timeout: 1000 });
  await page.locator("text=High risk").waitFor({ timeout: 1000 });
});

await step("core-loop callout renders", async () => {
  await page.locator("text=Blast radius analysis + test authoring").waitFor({ timeout: 1000 });
});

await step("hero waitlist form submits to confirmation state", async () => {
  const heroForm = page.locator("form").first();
  await heroForm.locator('input[type="email"]').fill("team@example.com");
  await heroForm.locator('button[type="submit"]').click();
  await page.locator("text=You're on the list").first().waitFor({ timeout: 2000 });
});

await step("closing CTA form is independent and still submittable", async () => {
  // the hero <form> unmounted when it submitted, so the only remaining
  // <form> on the page is the closing CTA's — .first() is correct here,
  // not a re-selection of the hero form.
  const closingForm = page.locator("form").first();
  await closingForm.locator('input[type="email"]').fill("team2@example.com");
  await closingForm.locator('button[type="submit"]').click();
  await page.locator("text=You're on the list").nth(1).waitFor({ timeout: 2000 });
});

await step("back link returns to /", async () => {
  await page.locator("a", { hasText: "Back to Ordino" }).click();
  await page.waitForURL("http://localhost:3000/");
});

await step("other 4 views still reachable", async () => {
  for (const [label, url] of [
    ["Desktop App", "http://localhost:3000/chat"],
    ["VS Code Extension", "http://localhost:3000/ide"],
    ["Terminal", "http://localhost:3000/terminal"],
    ["Coding Agent", "http://localhost:3000/agent"],
  ]) {
    await page.goto(url, { waitUntil: "networkidle" });
    if (page.url() !== url) throw new Error(`${label} did not stay on ${url}`);
  }
});

await step("mobile viewport has no horizontal overflow on /marketing", async () => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("http://localhost:3000/marketing", { waitUntil: "networkidle" });
  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  if (hasOverflow) throw new Error("horizontal overflow detected at 375px width");
});

console.log("\n--- console/page errors captured ---");
console.log(logs.length ? logs.join("\n") : "(none)");

await browser.close();
```

- [ ] **Step 2: Run it**

Run: `node verify-marketing-page.mjs` (from the scratchpad directory where Playwright is already installed locally this session)
Expected: every `step()` prints `OK`, and the console/page error list is `(none)`.

No commit for this task — it's a verification script only, not part of the repo.
