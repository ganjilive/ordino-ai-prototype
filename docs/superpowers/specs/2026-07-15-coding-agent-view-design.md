# 4th product surface: Coding Agent view (Claude Code invoking Ordino)

## Context

The prototype's home page (`/`) picks between three independent product
surfaces — Desktop App (`/chat`), VS Code Extension (`/ide`), Terminal
(`/terminal`) — each a self-contained way to demo the same underlying Ordino
concept to different audiences in a single session.

`docs/features.md` names "direct agent invocation" — a coding agent calling
Ordino programmatically mid-task, rather than a human copying a fix prompt
between tools — as the single highest-leverage undecided architecture
question. `docs/user-stories.md` has a full epic (§18) and a target-architecture
diagram for it (`CodingAgent --|invoke|--> Ordino`), but `docs/iteration-one.md`
explicitly defers it: "iteration one's trigger is human-initiated, not
agent-initiated." This design doesn't build the real capability — it adds a
4th scripted demo surface that shows what it would look like, so the idea can
be pitched visually before it's built.

A related seam already exists: `components/ide/terminal-panel.tsx` (inside
the VS Code Extension view) scripts a "Claude Code is running…" sequence that
already includes two `Ordino(verify-flows --before-pr)` tool-call steps.
Today those render identically to any other tool call (`Read`, `Edit`,
`Bash`) — same amber bullet, no visual distinction — so the hand-off to a
different agent doesn't read as anything special. This design's core visual
job is making that hand-off unmistakable, in a new standalone view built for
it.

## Goals

- A 4th card on `/`, labeled "Coding Agent," linking to a new route `/agent`.
- A Claude-Code-style terminal session where a visitor "gives Claude Code a
  task," the task plays out with realistic tool calls and diffs, and twice
  mid-task, Claude Code calls out to Ordino as a tool and gets a structured
  result back — visually distinct from Claude Code's own tool calls, using
  Ordino's real brand gradient (`--ordino-orange` → `--ordino-pink` →
  `--ordino-purple` → `--ordino-blue`, `app/globals.css`).
- The task is test automation: writing unit, integration, and e2e/front-end
  tests for the promo-code + tax path in `calculateTotal()` — continuing the
  same pricing/booking-api narrative already used in `/terminal` and
  `/ide`'s terminal panel, so the numbers and story stay consistent across
  the prototype without being imported from either.
- Fully independent: no imports from `app/ide`, `app/terminal`, or their
  `lib`/`components` subtrees. New `lib/agent/` and `components/agent/`,
  narrative content duplicated as literals (same tradeoff already made for
  `/terminal`'s `lib/terminal/companion-script.ts`).

## Non-goals

- No real Ordino API, MCP tool, or webhook — this is a scripted visual only,
  same as every other view in this prototype.
- No changes to `docs/iteration-one.md` scope — this is a pitch artifact for
  a deferred epic, not an implementation of it.
- No reuse of `components/ide/terminal-panel.tsx` or its script — new content
  in the same visual idiom, not a shared component.
- No PR link at the end (unlike `terminal-panel.tsx`'s "View PR #490 in
  Ordino") — linking into `/projects/...` would couple this otherwise
  independent view to another view's routes.

## Routing

- `app/agent/layout.tsx` — `metadata.title = "Ordino — Coding Agent"`,
  passthrough children. Mirrors `app/terminal/layout.tsx`.
- `app/agent/page.tsx` — mounts `<CodingAgentView />`. Mirrors
  `app/terminal/page.tsx`.
- `app/page.tsx` — add a 4th entry to the existing `PRODUCT_SURFACES` array:
  `{ href: "/agent", icon: Bot, title: "Coding Agent", description: ...,
  cta: "Open coding agent demo" }`. `Bot` from `lucide-react`. No changes to
  `ProductSurfaceCard` — it's already generic.

## Data model

`lib/agent/types.ts` — same shape as `lib/ide/types.ts`'s `TerminalStep`, kept
separate (not imported) per the independence goal:

```ts
export type AgentStepKind =
  | "tool"       // Claude Code's own tool call (amber bullet)
  | "result"     // Claude Code's own tool result (gray ⎿)
  | "text"       // Claude Code's own commentary
  | "diff"       // file diff block
  | "success"    // final success line
  | "ordino-call"   // Claude Code invoking Ordino (gradient box, header row)
  | "ordino-result"; // Ordino's structured response (same gradient box, body)

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

`ordino-call` and `ordino-result` are separate step kinds (rather than one
box with both request+response as separate fields) so the reveal animation
can show the call, then a beat of "Ordino thinking," then the result — same
staggered-reveal feeling as the rest of the script.

`lib/agent/agent-script.ts` — exports `agentScript: AgentStep[]`, hardcoded
per the narrative below (no fixture imports from `lib/ide/*`).

## The scripted narrative

1. `tool`/`result` pairs: `Read(src/lib/pricing.ts)`, `Read(src/lib/pricing.test.ts)`.
2. `text`: brief plan ("I'll add unit, integration, and e2e coverage for the promo-code + tax path.")
3. `tool` `Edit(src/lib/pricing.test.ts)` + `diff`: new unit test case for promo-code + tax.
4. `tool` `Edit(src/lib/checkout.integration.test.ts)` + `diff`: integration test covering the checkout flow.
5. `tool` `Bash(npm test -- pricing)` + `result`: pass.
6. `tool` `Edit(e2e/booking-flow.e2e.spec.ts)` + `diff`: front-end test covering the promo-code checkout UI.
7. `ordino-call`: `Ordino(check-cross-repo-impact)`.
8. `ordino-result`: `calculateTotal() is also called from ../booking-api/src/quote.ts (POST /checkout/quote) — no test covers the promo-code + tax path there.`
9. `text`: Claude Code acknowledges the gap, decides to close it before finishing.
10. `tool`/`result`: `Read(../booking-api/src/quote.ts)`.
11. `tool` `Edit(../booking-api/test/quote.test.ts)` + `diff`: the missing contract test.
12. `tool` `Bash(npm test)` + `result`: pass.
13. `ordino-call`: `Ordino(check-cross-repo-impact)` again.
14. `ordino-result`: `✓ All flows covered. No cross-repo gaps.`
15. `success`: "Done — added unit, integration, and e2e coverage for the promo-code + tax path, including the previously-untested booking-api contract."

## Visual language

`components/agent/coding-agent-view.tsx` — single client component, same
staggered-reveal-by-`setTimeout` pattern as `terminal-panel.tsx` and
`terminal-companion-view.tsx` (a `pendingSteps`/`revealedSteps` or
`revealedCount` state pair; no synchronous `setState` in the effect body, per
the `react-hooks/set-state-in-effect` fix already applied in
`terminal-companion-view.tsx`).

- Entry state: a Claude-Code-style prompt (teal `#4ec9b0`), placeholder `Add
  tests for the promo-code + tax path in calculateTotal`. Like
  `terminal-panel.tsx`, the actual typed text is decorative — Enter always
  plays `agentScript`.
- `tool` / `result` / `text` / `diff` / `success` steps reuse the exact
  existing idiom and colors from `terminal-panel.tsx`'s `TerminalStepView`
  (amber `#e5c07b` ● bullets, gray `#6b6b6b` ⎿ results, red/green diff
  blocks, green `#89d185` ✔ success).
- `ordino-call` + `ordino-result` render together as one bordered box (like
  `/terminal`'s "finding" box), styled with Ordino's brand gradient — reuse
  the existing `.ordino-gradient-ring`/`.ordino-gradient-bg` utility classes
  from `app/globals.css` (same ones used in `components/shell/logo-mark.tsx`
  and `components/ide/ordino-panel.tsx`) for the box border/badge, with a
  small "Ordino" label so it's unmistakably a different agent responding,
  not another Claude Code tool line.
- A "Claude Code is running…" pulsing indicator (teal dot) shows while
  `agentScript` is still revealing, matching `terminal-panel.tsx`.

## Header

Same convention as `terminal-companion-view.tsx`: a top bar with a "←
Ordino" link back to `/`, a `Bot` icon, the title "Coding Agent," and a
`booking-website` label on the right.

## Verification

No test runner in this repo — same convention as every other view built this
session:
1. `npx tsc --noEmit` — no errors.
2. `npm run lint` — no errors.
3. Playwright pass through the dev server: from `/`, open the new "Coding
   Agent" card → confirm it lands on `/agent` → type any text into the
   prompt and press Enter → confirm the script plays through in order →
   confirm both `ordino-call`/`ordino-result` boxes render with the gradient
   styling, visually distinct from the amber tool-call lines → confirm the
   final success line appears → confirm the back-link returns to `/` → zero
   console/page errors.
