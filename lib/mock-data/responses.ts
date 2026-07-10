export interface ScriptedResponse {
  id: string;
  agentId: string;
  /** Keywords that, if present in the user message, trigger this specific scripted response. */
  triggers: string[];
  content: string;
}

export const scriptedResponses: ScriptedResponse[] = [
  {
    id: "test-automation",
    agentId: "qe-specialist",
    triggers: ["automat"],
    content: `I scanned the booking-website repo's current test setup before proposing anything.

Here's the automation plan for the checkout flow:

- Framework: Playwright (already used in 2 other suites in this repo) for E2E, Vitest for unit/component tests
- New E2E specs: guest checkout, saved-card checkout, promo code edge cases, payment failure retry
- Test data: seed 4 fixture bookings via the existing /test-utils/seed script instead of hitting prod-like data
- CI: run the new suite on every PR touching /src/checkout/**, nightly full run on main

I can scaffold the first spec (guest checkout) right now if you want to see the shape of it, or generate all 4 as draft PRs for review.`,
  },
  {
    id: "test-coverage",
    agentId: "qe-specialist",
    triggers: ["coverage"],
    content: `Pulled coverage data from the latest GitHub Actions run on main.

Overall line coverage: 71% (up from 66% last month)

By area:
- src/checkout: 84%
- src/booking-flow: 58% — lowest in the repo, and it's the area with the most bug reports last sprint
- src/auth: 92%
- src/shared/components: 65%

booking-flow is the clear gap. The date-picker edge cases (timezone rollover, DST) and the multi-room selection logic have zero test coverage right now. Want me to draft a coverage-improvement plan for that module specifically?`,
  },
  {
    id: "code-quality",
    agentId: "code-quality",
    triggers: ["quality"],
    content: `Ran static analysis against the current main branch (GitHub-connected repo: booking-website).

Findings:
- Cyclomatic complexity hotspot: BookingFormController.tsx (complexity 34) — recommend splitting the validation logic out
- 12 files flagged for duplicated logic between src/booking-flow and src/checkout (date formatting, price calc)
- Tech debt marker count: 23 TODO/FIXME comments, 6 of them over a year old
- No critical security lint findings this run

The duplicated price-calculation logic is the one I'd prioritize — it's already caused one bug (rounding mismatch between cart total and checkout total, fixed in PR #482). Want me to open a refactor proposal to consolidate it into a shared utility?`,
  },
  {
    id: "feature-planning",
    agentId: "deep-reasoning",
    triggers: ["plan", "feature", "requirement"],
    content: `Let's break this down before writing any code.

To plan this well I'd want to confirm a few things:
1. Who's the primary user of this feature — end customer or internal ops?
2. Is this additive to the existing booking flow, or does it change an existing step?
3. Any hard constraints — deadline, must integrate with a specific tool, compliance requirement?

Assuming this is a customer-facing addition to the booking flow, here's a first-pass plan:

- Phase 1 — Design: confirm UX with a quick prototype, define the data model changes needed
- Phase 2 — Backend: new endpoint(s), migration if the data model changes, feature-flagged rollout
- Phase 3 — Frontend: implement behind the flag, wire up analytics events so we can measure adoption
- Phase 4 — QA: hand off to QE Specialist for test plan + coverage once the shape is locked
- Phase 5 — Rollout: staged rollout, monitor error rate and drop-off in the funnel

I can turn this into a Linear epic with sub-issues once you confirm the scope questions above.`,
  },
  {
    id: "quality-metrics",
    agentId: "metrics-analyst",
    triggers: ["metric"],
    content: `Here's the quality snapshot for this project over the last 30 days:

- Test coverage: 71% (+5pts)
- Open defects: 14 (3 critical, 6 major, 5 minor)
- Escaped defect rate: 2.1% (defects found in prod vs. pre-release)
- Avg. PR review time: 6.4 hours
- Build success rate (main): 94%
- Flaky test rate: 3.8% of E2E runs

Trend-wise, coverage is improving steadily but the flaky test rate ticked up this week — 3 tests in the booking-flow suite are the repeat offenders. Want me to put together a dashboard view of this, or dig into the flaky tests first?`,
  },
];

export const genericFallbackByAgent: Record<string, string> = {
  "qe-specialist":
    "I can help with test automation and coverage for this project. Try asking me to plan test automation for a feature, or to check current test coverage.",
  "code-quality":
    "I can help assess code quality for this project's repo. Try asking me about code quality, complexity hotspots, or tech debt.",
  "metrics-analyst":
    "I can pull together quality metrics for this project. Try asking for a quality metrics summary or trend report.",
  "deep-reasoning":
    "I can help plan a new feature end-to-end — requirements, phases, and rollout. Describe what you'd like to build and I'll put together a plan.",
};
