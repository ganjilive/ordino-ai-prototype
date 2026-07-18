export interface ScriptedResponse {
  id: string;
  agentId: string;
  /** Keywords that, if present in the user message, trigger this specific scripted response. */
  triggers: string[];
  content: string;
}

export const scriptedResponses: ScriptedResponse[] = [
  {
    id: "root-cause-analysis",
    agentId: "qe-specialist",
    triggers: ["root cause", "why did", "why does", "timing out", "time out"],
    content: `I pulled the last 12 runs of booking-flow.e2e.spec.ts to check the "apply promo code" step specifically, since that's where recent failures cluster.

4 of the last 12 runs timed out at that exact step. I cross-referenced booking-api's response times around each failure:

- booking-api's /checkout/quote endpoint p95 latency rose from 180ms to 2.1s starting 3 days ago
- The timing lines up exactly with the 4 timeouts

This isn't a flaky test — it's a real regression in booking-api, most likely a caching layer that was removed or misconfigured on /checkout/quote. Extending the test's timeout would hide the regression instead of fixing it.

Want me to open an issue against booking-api with this timing data attached?`,
  },
  {
    id: "test-planning",
    agentId: "qe-specialist",
    triggers: ["test plan", "how should we test"],
    content: `Before writing any test code, here's how I'd split coverage for the loyalty points redemption feature (BOOK-510):

- Developer/unit tests (booking-website): points-balance validation, redemption math — fast, run on every commit
- Integration tests: the call from booking-website to loyalty-service's ledger API, where points actually get deducted
- System/e2e tests (staging): the full redemption flow end to end, including combining a promo code with points in the same order — the case most likely to get missed if we only test the happy path

That last combination case is the one I'd flag as highest-risk — want me to hand this plan to QE Specialist for test-case authoring once you confirm the split?`,
  },
  {
    id: "test-authoring",
    agentId: "qe-specialist",
    triggers: ["write test cases", "author test cases", "test cases for"],
    content: `Drafting test cases for BOOK-510 from the acceptance criterion plus the gaps flagged during requirement analysis, in Gherkin:

Feature: Loyalty points redemption at checkout

  Scenario: Guest redeems points below their balance
    Given a guest has 500 loyalty points
    When they redeem 200 points at checkout
    Then the order total is reduced by $2.00 (1 point = $0.01)

  Scenario: Guest attempts to redeem more points than they have
    Given a guest has 500 loyalty points
    When they attempt to redeem 800 points at checkout
    Then the redemption is capped at 500 points, not rejected

  Scenario: Guest combines a promo code with points in the same order
    Given a guest has a valid promo code and a points balance
    When they apply both at checkout
    Then both discounts are applied, promo code first and points second

  Scenario: Guest is refunded after redeeming points
    Given a guest has redeemed points on a completed order
    When that order is refunded
    Then the redeemed points are restored to their balance

Scenarios 2-4 come directly from the ambiguity I flagged in the original requirement, not from the acceptance criterion alone.

Ordino(write-test-cases --requirement=BOOK-510 --target=qase)
✓ Written to Qase — 4 scenarios added to suite "Loyalty Points Redemption" (BOOK-510)

Want me to link the new Qase suite in a comment on BOOK-510?`,
  },
  {
    id: "auto-healing",
    agentId: "qe-specialist",
    triggers: ["auto-heal", "auto heal", "self-heal", "selector drift"],
    content: `Scanned for selector drift across the active E2E suite.

Found one: checkout-payment.e2e.spec.ts was asserting against a button labeled "Pay now" — that button was renamed to "Complete purchase" 2 days ago, and the test has been failing since.

I healed it automatically — updated the selector from getByText('Pay now') to getByText('Complete purchase'). No human review needed for a label-only change like this; it's logged for audit.

I'll still flag it for a human if the same selector needs healing more than twice in 30 days — that usually means the UI is genuinely unstable, not just renamed.`,
  },
  {
    id: "requirement-analysis",
    agentId: "qe-specialist",
    triggers: ["book-510", "loyalty points requirement", "ready for development"],
    content: `Pulled BOOK-510 from Jira: "As a guest, I can redeem loyalty points at checkout to reduce my total."

That's the only acceptance criterion on the ticket. Before this is ready for development, I'd want three things clarified:

1. What happens to redeemed points if the order is later refunded?
2. Is there a maximum percentage of the order that can be paid with points?
3. How does point redemption interact with a promo code applied to the same order?

None of these are answered right now, and all three are the kind of gap that turns into rework mid-sprint rather than a quick clarification up front. Want me to draft the follow-up questions as a comment on BOOK-510?`,
  },
  {
    id: "blast-radius",
    agentId: "qe-specialist",
    triggers: ["blast radius", "cross-repo risk", "what does this change affect"],
    content: `Checked what calculateTotal() in src/lib/pricing.ts actually touches outside this repo before you rely on local test coverage alone.

- calculateTotal() is called directly by booking-api's POST /checkout/quote endpoint
- booking-api has no test covering the promo-code + tax interaction in that call path
- Any change to the discount/tax logic in booking-website will silently affect quotes returned by booking-api, with nothing catching it until a customer notices a wrong total

This is the same risk your local test suite can't see, no matter how good coverage looks here — it only shows up if something is watching across repos. Want me to open a tracking issue against booking-api for the missing test?`,
  },
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
