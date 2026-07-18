# Marketing page: pitching Ordino as "QA for the agentic era"

## Context

The prototype's home page (`/`) already links out to two static internal
docs — `public/research-findings.html` ("Research Findings") and
`public/design-brief.html` ("Read the Design Brief") — both written in a
standalone cream/rust visual style, meant to be read as internal reports.

This adds a third artifact: a marketing page the user can show their team to
demonstrate how Ordino would actually be pitched to a customer. Unlike the
two existing docs, this is a real in-app route (`/marketing`), built in the
product's own visual system (dark theme, Geist font, `ordino-gradient-*`
utilities from `app/globals.css`) rather than the brief's cream styling — the
point is to show the team what the pitch would look and feel like as part of
the actual product, not as another static report.

Content is drawn from `public/design-brief.html` and
`public/research-findings.html`, in particular:
- The "quality owner" persona (QA engineer, tech lead, release manager) —
  not the developer — as who Ordino is for.
- The problem stats (7,839 LOC/dev/month, +76%; 85%+ of enterprise QA teams
  report a bottleneck; +199.6% PR review time).
- The "before the PR exists" constraint as the hero problem, and the
  three-surface architecture (direct use, background watcher, called by
  other AI agents via MCP) as how it's delivered.
- All 7 capabilities, shown with equal visual weight so a customer reads
  Ordino as covering a full team's worth of QA work (test planning,
  authoring, automation, root cause analysis, auto healing, requirement
  analysis, blast radius analysis) — not a narrow point tool. Within that
  set, **Blast Radius Analysis** and **Test Authoring** are flagged as the
  core pair via a small badge, not split into a separate dominant callout —
  per user direction, the page needs to convey breadth ("Ordino can do a
  lot of my team's usual QA work") first, with the flagship duo as a nod
  inside that breadth rather than the headline act.

A note on framing, settled during brainstorming: the "Why" section must stay
centered on the **quality owner's** blind spot (signing off on a merge/release
without knowing what else it touches), not the developer's commit-time
workflow — an earlier draft used a developer-voiced quote ("I want to know,
in my own terminal...") that was rejected for centering the wrong persona.
The section also has to preempt the obvious objection — "don't integration
tests already solve this?" — head-on: the blind spot is *discovery* (nobody
knew the change reached another repo at all), not a gap in testing
discipline, so more integration tests don't fix it if nobody knew to write
one for that path in the first place.

## Goals

- A new route `/marketing`, reachable from `/` via a third button — "View
  Marketing Page" — added next to the existing two.
- A single scrolling page, structured What → Why → How, positioning Ordino
  as "QA for the agentic era."
- Hero section with a headline + subhead and a "Join the waitlist" CTA. The
  CTA is decorative only: a client-side form that shows a confirmation state
  on submit, no network call, no data persisted.
- Built entirely from existing design tokens and shadcn primitives already
  in the repo (`Button`, `Input`, `Badge`) — no new dependencies.

## Non-goals

- No real waitlist backend, email capture, or analytics.
- No changes to `public/research-findings.html` or `public/design-brief.html`
  — this page is additive, not a replacement.
- No interactive/animated terminal typing sequence (unlike `/agent` or
  `/terminal`) — the one interface sketch used here (the Slack risk
  notification) is static, matching the "skimmable pitch page" goal agreed
  during brainstorming.
- No separate, visually dominant "hero capability" callout box for Blast
  Radius Analysis + Test Authoring — they stay inside the main 7-capability
  grid, marked with a small "Core" badge, so the section reads as full
  breadth first.

## Routing

- `app/marketing/layout.tsx` — `metadata.title = "Ordino — QA for the
  Agentic Era"`, passthrough children. Mirrors `app/terminal/layout.tsx` /
  `app/agent/layout.tsx`.
- `app/marketing/page.tsx` — server component that lays out all sections
  and mounts the one client island (`WaitlistForm`).
- `app/page.tsx` — add a third action button next to the existing two, using
  the same `buttonVariants` pattern already used there:
  ```tsx
  <a href="/marketing" className={buttonVariants({ variant: "outline", size: "lg" })}>
    <Megaphone className="h-4 w-4" />
    View Marketing Page
  </a>
  ```
  `Megaphone` from `lucide-react`, `outline` variant (the two existing
  buttons are `default`) so the pitch page reads as a distinct kind of
  action from the two reference docs. Unlike those two (which use
  `target="_blank"` to a static HTML file), this is a real in-app route, so
  it's a plain internal link — no `target`/`rel`.

## Page structure (`app/marketing/page.tsx`)

Five sections, in order, each a `<section>` with consistent max-width/padding
(`mx-auto max-w-5xl px-6`) matching `app/page.tsx`'s existing container
convention.

### 1. Hero

- Badge: "QA for the agentic era"
- `h1`: "Your agents ship code fast. Is your QA keeping up?"
- Subhead: "Ordino is the always-on QA teammate for the agentic era — it
  sees across every repo your team owns, catches what a change breaks
  before the PR exists, and does the testing work your team already does,
  just faster."
- `<WaitlistForm />` (see below)
- Decorative gradient ring glow behind the headline, reusing
  `.ordino-gradient-ring` (same technique as `LogoMark`, scaled up and
  blurred via a large absolutely-positioned div, not a new utility class).

### 2. What

- Kicker: "What is Ordino"
- `h2`: "QA, built for how software gets made now"
- Body paragraph: Ordino is an always-on quality partner for whoever owns
  product quality — a QA engineer, tech lead, or release manager. It
  connects to the repos, requirements, test-management, and communication
  tools already in use, and takes on the actual work of testing: planning
  it, writing it, running it, and explaining why it broke.

### 3. Why

- Kicker: "Why it matters"
- `h2`: "AI writes code faster than anyone can verify it"
- Stat strip: 3 stat cards in a row (`grid grid-cols-1 sm:grid-cols-3 gap-4`),
  each a bordered card with a large number + short label:
  - "7,839 lines / developer / month" — "up 76% in a year"
  - "85%+" — "of enterprise QA teams say AI code generation has outpaced
    their ability to test it"
  - "+199.6%" — "median PR review time under high AI adoption"
- Blind-spot narrative, centered on the quality owner: "For a quality owner
  accountable for a product built across many repos, that bottleneck isn't
  backlog — it's blind spots. A developer changes one piece, and nothing
  tells the quality owner what else it touches, until CI fails somewhere
  else — often after they've already signed off."
- Objection-handling callout (bordered card, visually distinct from the
  narrative paragraph — e.g. a left accent border): "**Isn't this just
  integration testing?** Integration tests only catch what someone already
  thought to test. The blind spot isn't a missing test suite — it's not
  knowing a change reaches into another repo at all, until it's already
  merged. Ordino surfaces that reach before the PR exists, including paths
  nobody flagged for coverage in the first place." This mirrors the
  checkout/booking-api scenario already on `app/page.tsx`, kept consistent
  in wording but not literally duplicated.
- Pull-quote, reframed to the quality owner's sign-off moment (not the
  developer's commit-time moment used in the design brief's original
  wording): *"Before I approve this, I want to know what it actually
  touches — and whether it's covered."* — caption: "The same blind spot
  developer interviews confirmed, now from the seat that has to approve
  it."
- Closing line: "That's the moment nothing else catches. Ordino is built to
  catch it before sign-off."

### 4. How

- Kicker: "How it works"
- `h2`: "One QA teammate, wherever your team already works"
- Three surface cards (`grid grid-cols-1 sm:grid-cols-3 gap-4`):
  - "Direct use" — chat, terminal, or IDE panel — the quality owner's own
    workspace.
  - "Background watcher" — runs alongside the repo, notifies through Slack
    or PR comments — no new interface to check.
  - "Called by other agents" — Claude Code, Cursor, or any MCP-capable
    agent invokes Ordino mid-task.
- `<RiskNotificationMockup />` directly under the three cards, captioned
  "The background watcher in action — nobody asked, Ordino noticed."
- Transition line ahead of the capability grid, setting up "this is a lot of
  your team's QA work, not one point feature": "Ordino covers the QA work
  your team already does today — planning, authoring, automation, root
  cause analysis, and more — so quality keeps pace with how fast agents can
  now write code. Two capabilities carry the rest: blast radius analysis
  tells Ordino what's at risk, and test authoring writes the tests to cover
  it."
- Full 7-capability grid (`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
  gap-3`), all cards equal size/weight (`border-border bg-card`, not muted):
  Test Automation, Root Cause Analysis, Test Authoring, Test Planning, Auto
  Healing, Requirement Analysis, Blast Radius Analysis. Descriptions taken
  verbatim from the design brief's capability list. The two flagship cards
  (Test Authoring, Blast Radius Analysis) get a small "Core" label
  (`ordino-gradient-text`, top-right of the card) and a `border-primary`
  border instead of `border-border` — a flag within the grid, not a
  separate box pulled out of it.

### 5. Closing CTA

- `h2`: "Be first to bring Ordino to your team"
- `<WaitlistForm />` again (second instance, same component).
- Minimal footer: "← Back to Ordino" link to `/`.

## Components

### `components/marketing/waitlist-form.tsx`

Client component (`"use client"`). Local `useState<"idle" | "submitted">`.
- Idle: an `Input` (type email, placeholder "you@company.com") + `Button`
  ("Join the waitlist") in a row, wrapped in a `<form>` with
  `onSubmit={(e) => { e.preventDefault(); setStatus("submitted"); }}` — no
  `fetch`, no persistence, per the Non-goals section.
  - `required` on the input for basic browser-level validation feedback,
    since the form is otherwise a no-op — keeps the interaction honest
    rather than accepting empty submissions.
- Submitted: replaces the form with a short confirmation line ("You're on
  the list — we'll be in touch.") plus a checkmark icon (`CheckCircle2`
  from `lucide-react`).
- Rendered twice on the page (hero + closing CTA) as two independent
  instances — no shared state between them.

### `components/marketing/risk-notification-mockup.tsx`

Presentational component, static (no props). Recreates the Slack risk-flag
notification from `public/design-brief.html` (`.slack-msg` block) using the
app's own theme tokens instead of the brief's inline colors:
- Rounded card (`rounded-lg border border-border bg-card`), left accent
  border using `--destructive` to signal "risk" (the app's own palette has
  no equivalent to the brief's `--accent` rust tone, and `--destructive` is
  the existing token closest in meaning).
- Header row: small square avatar with "O" (Ordino's initial, similar
  treatment to `LogoMark`'s ring but static), "Ordino" name + a muted "APP"
  tag + timestamp.
- Body text: "Risk flag — PR #482 'Refactor payment gateway client'. This
  change touches shared code used by 3 other repos: checkout-service,
  notifications-service, billing-service. Test coverage for the affected
  functions is 41%." (same content as the design brief's mockup, kept
  verbatim since it's already a concrete, credible example).
- A `Badge` with `variant="destructive"` reading "High risk."
- Two ghost-style action affordances ("View PR", "View full report") as
  plain styled spans — not real links, consistent with the rest of the page
  being a static pitch artifact.

## Verification

No test runner in this repo — same convention as prior sessions (see
`2026-07-15-coding-agent-view-design.md`):
1. `npx tsc --noEmit` — no errors.
2. `npm run lint` — no errors.
3. Manual pass through the dev server: from `/`, confirm the new "View
   Marketing Page" button appears and links to `/marketing`; on the
   marketing page, confirm all five sections render in order; type an email
   into the hero waitlist form and submit — confirm it swaps to the
   confirmation state without a page reload or network request; repeat for
   the closing CTA form independently; confirm the risk-notification mockup
   renders; confirm the "← Back to Ordino" footer link returns to `/`; zero
   console/page errors; spot-check at a mobile width that the stat strip,
   surface cards, and capability grid reflow to a single column.
