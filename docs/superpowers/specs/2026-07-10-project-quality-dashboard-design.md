# Project page: Quality Insight Dashboard + in-context Ordino chat

## Context

Ordino AI's prototype lets you create/select projects (`/projects`) and chat
with Ordino (`/chat`), but there's no page where a project's own quality
picture — test runs, coverage — lives as a first-class view. This is the
second of two "show Ordino inside the tools engineers actually use" scenes
(the first being the `/ide` VS Code mockup). This one shows Ordino as a
project-scoped dashboard companion: a Quality Insight Dashboard with Ordino
chat sitting alongside it, scoped to that project's context.

The existing seed data already contains a real, specific quality narrative for
the "Booking Website" project — a conversation where the QE Specialist agent
reports 71% overall coverage (up from 66%), a per-area breakdown, and a
separate "quality metrics" script with defect/build/flaky-test numbers. This
design reuses those numbers rather than inventing conflicting ones, and reuses
the real chat store rather than building a second parallel chat system (unlike
the intentionally self-contained `/ide` scene, which depicts a hypothetical
surface outside Ordino itself).

## Goals

- Clicking a project's name/card on `/projects` opens a dedicated project page
  at `/projects/[projectId]` inside the existing shell chrome.
- The page shows a Quality Insight Dashboard (latest test runs, coverage
  trend, coverage by type) as the main view, with a persistent Ordino chat
  panel scoped to the project on the right.
- Booking Website gets full mock data. Internal Admin Console gets a "no
  quality data yet" empty state — no new dashboard data invented for it.
- The chat panel is the same underlying chat system as `/chat` (store,
  agent-router, message components), not a duplicate.

## Non-goals

- No changes to what "Open project" on `/projects` does today (still routes
  to `/chat`).
- No new "coverage by area" data — that already exists in the seed
  conversation and isn't duplicated on the dashboard.
- No new chat/agent logic — the QE Specialist / agent-router already handles
  coverage and quality-metric questions.

## Routing

`app/(shell)/projects/[projectId]/page.tsx` — stays inside the `(shell)` route
group (keeps `AppSidebar`/`TopBar`, unlike `/ide` which deliberately escapes
it). In this Next.js version `params` is a `Promise`, and since this page
needs client-side interactivity (the chat panel, dashboard widget state), it
unwraps `params` with React's `use()` in a `"use client"` component rather
than being an async server component.

On `/projects`, clicking a project's name or card body (not the existing
"Open project" button/link) navigates to this route. `ProjectCard` gets a
`Link`/`onClick` on the name/body distinct from the existing "Open project"
button, which keeps routing to `/chat` exactly as it does today.

## Layout

Two columns inside the existing shell `<main>`:
- **Left (main, scrollable):** page header (project name/description) +
  Quality Insight Dashboard.
- **Right (fixed-width panel, ~380–420px):** Ordino chat, scoped to this
  project. Trimmed relative to the full `/chat` page — message list + input
  only, no agent picker, no history drawer.

## Chat panel — reusing the real store

On mount:
1. Call `setActiveProjectId(projectId)` (existing store action) so the
   project switcher / global state stays in sync with the page you're on.
   Note this resets `activeConversationId` to `null`.
2. Look up this project's conversations and, if one exists, call
   `setActiveConversationId` on the most recently created one — so Booking
   Website's page opens directly into the existing seeded "Test coverage
   check-in" conversation instead of a blank slate.
3. Render with the existing `EmptyState`, `MessageList`, `MessageBubble`, and
   `ChatInput` components and the existing `sendMessage` / `routeMessage`
   flow — identical mechanics to `app/(shell)/chat/page.tsx`, just without
   `HistoryDrawer`/`AgentPicker` in this trimmed layout, and permanently
   scoped to `projectId` rather than the page-level `activeProjectId` lookup
   (though they're set to be the same project once step 1 runs).

No new mock conversation data, no new agent, no new keyword routing — the
existing `lib/mock-data/responses.ts` scripted responses (`test-coverage`,
`code-quality`, `quality-metrics`, etc.) already answer the kinds of
questions this dashboard's chat panel invites.

## Quality Insight Dashboard — data and widgets

New mock data module (e.g. `lib/mock-data/quality.ts`), keyed by project id,
providing data for Booking Website only:

**Coverage trend** (weekly, ending at today, matching the seed conversation's
"71%, up from 66% last month"):
`65, 66, 67, 68, 70, 71` (percent, oldest → newest).

**Coverage by type** (unit / integration / front-end — a distinct breakdown
from the existing "by area" one already in chat, not a replacement for it):
`Unit 83%, Integration 68%, Front-end 55%`.

**Latest test runs** (newest first — the first entry deliberately mirrors the
exact fix demonstrated in the `/ide` scene, closing the loop between the two
prototypes):
1. `src/lib/pricing.test.ts` — Unit — Passed — 6/6 — 2 minutes ago
2. `checkout.e2e.spec.ts` — Integration — Passed — 14/14 — 18 minutes ago
3. `booking-flow.e2e.spec.ts` — Integration — Failed (flaky) — 11/14 — 1 hour
   ago — note: "3 tests flaky in this suite" (echoes the existing
   quality-metrics chat response's flaky-test callout)
4. `auth.test.ts` — Unit — Passed — 22/22 — 3 hours ago
5. `shared-components.test.ts` — Unit — Passed — 9/9 — 5 hours ago

**Widget forms** (per the dataviz skill's form/color rules):
- A small stat-tile row up top: overall coverage (71%, +5pts, matching the
  seed data) as the headline number, plus 1–2 secondary tiles pulled from the
  existing quality-metrics response (e.g. build success rate 94%, flaky test
  rate 3.8%) — reusing exact existing numbers, no new ones invented here.
- Coverage trend → single-hue line chart (trend-over-time job). One series,
  so no legend; direct-label the latest value and the delta.
- Coverage by type → single-hue horizontal bars (compare-magnitude job),
  ordered high→low, direct-labeled with the percentage — not a categorical
  rainbow, since the three categories are already distinguished by their
  axis labels.
- Both coverage charts use the same accent hue: `var(--ordino-orange)`,
  visually tying the data to the QE Specialist agent (already orange in
  chat) that reports on it.
- Latest test runs → a status list/table, not a chart. Status uses a fixed,
  reserved status color (never the categorical/brand hues): a new
  `--success` token for "Passed", the existing `--destructive` for "Failed",
  each always paired with an icon + label (never color alone).
- Hand-rolled inline SVG/CSS — no new charting dependency, consistent with
  the rest of this prototype.

## New design token: `--success`

The app's palette (`app/globals.css`) currently has no green — deliberate,
since the product's categorical identity is the orange/pink/purple/blue
Ordino gradient. But per the dataviz skill, status color is reserved and
fixed, separate from the categorical theme, so introducing one green token
for "passed/good" is the correct move rather than reusing a categorical hue
for status.

Add to `:root` and `.dark` in `app/globals.css`, following the existing
`--destructive` pattern (oklch, lighter in dark mode):
- `:root`: `--success: oklch(0.5 0.16 145);` — verified 5.59:1 WCAG contrast
  against the light `--card` (oklch(1 0 0)), comfortably above the 4.5:1 text
  threshold.
- `.dark`: `--success: oklch(0.72 0.17 145);` — verified 7.61:1 against the
  dark `--card` (oklch(0.21 0.006 60)).
- Register `--color-success: var(--success);` in the `@theme inline` block
  alongside the other semantic colors, so `text-success`/`bg-success` become
  available Tailwind utilities.

Contrast was computed directly (OKLCH → linear sRGB → WCAG relative
luminance) rather than via the dataviz skill's palette validator, since that
script validates categorical palettes and this is a single status color (the
skill's own scope note: single status colors get a plain WCAG contrast
check, not the six-point categorical validator).

## Internal Admin Console

Same route, same page component. If the project has no entry in the new
quality mock-data module, render a simple centered empty state ("No quality
data yet for this project") in place of the dashboard widgets. The chat panel
still works normally (it already supports arbitrary projects via the generic
agent-router fallback responses).

## Verification

- `npm run dev`, go to `/projects`, click the Booking Website card's
  name/body (not "Open project") → lands on `/projects/proj-booking-website`
  inside the normal shell chrome.
- Confirm "Open project" on the card still routes to `/chat` unchanged.
- Confirm the chat panel opens directly into the existing "Test coverage
  check-in" conversation, and that asking a new question (e.g. "what's our
  code quality like") gets routed to the Code Quality agent via the existing
  agent-router, matching `/chat`'s behavior.
- Confirm the three dashboard widgets render with the exact numbers listed
  above, the coverage-trend chart's latest point reads 71%, and the test-runs
  list's top entry is the passed `pricing.test.ts` run.
- Click into Internal Admin Console's project page → confirm the "no quality
  data yet" empty state renders and the chat panel still works.
- Toggle the app's light/dark theme and revisit both project pages → confirm
  the dashboard (including the new `--success` token) reads correctly in
  both modes.
