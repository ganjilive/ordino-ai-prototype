import type { TerminalCompanionStep } from "@/lib/terminal/types";

export const bannerSteps: TerminalCompanionStep[] = [
  {
    id: "banner-title",
    kind: "banner-title",
    delayMs: 300,
    text: "✻ Welcome to Ordino!",
  },
  {
    id: "banner-hint",
    kind: "banner-line",
    delayMs: 250,
    text: "/help for help · booking-website (main)",
  },
  {
    id: "banner-cwd",
    kind: "banner-line",
    delayMs: 250,
    text: "Watching for changes · quality snapshot loaded",
  },
  {
    id: "banner-finding-tool",
    kind: "tool",
    delayMs: 500,
    text: "Checking cross-repo impact — scanning granted repos for callers of calculateTotal()…",
  },
  {
    id: "banner-finding",
    kind: "finding",
    delayMs: 700,
    text: "calculateTotal() in src/lib/pricing.ts is also called from ../booking-api/src/quote.ts (POST /checkout/quote). booking-api has no test covering the promo-code + tax path — this could silently diverge from what that endpoint returns.",
  },
];

export const SUGGESTED_QUESTIONS = [
  { label: "What's our test coverage?", prompt: "What's our test coverage?" },
  { label: "Any flaky tests?", prompt: "Any flaky tests?" },
  { label: "Is this safe to ship?", prompt: "Is this safe to ship?" },
  {
    label: "Generate tests for the booking flow",
    prompt:
      "Generate front-end test automation for the critical booking flow at https://staging.booking-website.dev. Flow: search rooms → select dates → apply promo code → complete payment. Requirement details are in BOOK-482.",
  },
  {
    label: "Write test cases for loyalty points",
    prompt: "Write test cases for the loyalty points requirement.",
  },
  {
    label: "Plan tests for loyalty points",
    prompt: "How should we test the new loyalty points redemption feature? (test plan for BOOK-510)",
  },
  {
    label: "Why does booking-flow keep timing out?",
    prompt:
      "What's the root cause — why does the apply-promo-code step in booking-flow.e2e.spec.ts keep timing out?",
  },
  {
    label: "Any tests auto-healed recently?",
    prompt: "Have any tests been auto-healed recently? Check for selector drift.",
  },
  {
    label: "Is the loyalty points requirement ready?",
    prompt: "Is the BOOK-510 loyalty points requirement ready for development?",
  },
];

const TEST_AUTHORING_KEYWORDS = ["write test cases", "author test cases", "test cases for"];
const TEST_PLANNING_KEYWORDS = ["test plan", "how should we test", "plan tests"];
const ROOT_CAUSE_KEYWORDS = ["root cause", "why did", "why does", "why is booking-flow"];
const AUTO_HEAL_KEYWORDS = ["auto-heal", "auto heal", "self-heal", "selector drift"];
const REQUIREMENT_ANALYSIS_KEYWORDS = ["book-510", "loyalty points requirement", "ready for development"];
const GENERATE_TESTS_KEYWORDS = ["generate", "critical flow", "front-end test automation"];
const COVERAGE_KEYWORDS = ["coverage", "tested"];
const FLAKY_KEYWORDS = ["flaky", "flake"];
const BUILD_KEYWORDS = ["build", "ci", "pipeline"];
const FAILING_KEYWORDS = ["failing", "failed", "broke", "broken", "red"];
const SAFE_TO_SHIP_KEYWORDS = ["safe", "ship", "merge", "release", "ready"];
const RISK_KEYWORDS = ["risk", "worried", "worry", "cross-repo", "booking-api"];

export function answerQuestion(question: string): TerminalCompanionStep[] {
  const normalized = question.toLowerCase();

  if (TEST_AUTHORING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      { id: "tool-author", kind: "tool", delayMs: 500, text: "Ordino(author-test-cases --requirement=BOOK-510)" },
      {
        id: "tool-result-author",
        kind: "tool-result",
        delayMs: 500,
        text: "Drafting cases from the acceptance criterion and the 3 gaps flagged earlier…",
      },
      {
        id: "answer-author",
        kind: "answer",
        delayMs: 800,
        text: "Draft cases: (1) guest with 500 points redeems 200 at checkout — total reduces by $2.00 at 1 point = $0.01; (2) guest tries to redeem more points than they have — redemption is capped, not rejected; (3) guest combines a promo code and points in one order — both discounts apply, in that order; (4) guest requests a refund after redeeming points — points are restored to their balance. Cases 2–4 come directly from the gaps I flagged in the requirement, not the acceptance criterion alone. Want me to open a comment on BOOK-510 with these?",
      },
    ];
  }

  if (TEST_PLANNING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      { id: "tool-plan", kind: "tool", delayMs: 500, text: "Ordino(plan-tests --requirement=BOOK-510)" },
      {
        id: "tool-result-plan",
        kind: "tool-result",
        delayMs: 500,
        text: "Cross-referencing booking-website, loyalty-service, and booking-api…",
      },
      {
        id: "answer-plan",
        kind: "answer",
        delayMs: 800,
        text: "Here's the split I'd recommend: developer/unit tests for the points-balance validation and redemption math (fast, in booking-website); integration tests for the call to loyalty-service's ledger API, where points actually get deducted; and one system/e2e test on staging covering the full redemption flow end to end, including combining a promo code with points in the same order — that's the case most likely to be missed.",
      },
    ];
  }

  if (ROOT_CAUSE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-rca",
        kind: "tool",
        delayMs: 500,
        text: "Ordino(analyze-failure --test=booking-flow.e2e.spec.ts --step=apply-promo-code)",
      },
      { id: "tool-result-rca", kind: "tool-result", delayMs: 500, text: "12 recent runs: 4 timed out, all at the same step" },
      {
        id: "tool-rca-cross",
        kind: "tool",
        delayMs: 500,
        text: "Cross-referencing booking-api response times around each failure…",
      },
      {
        id: "tool-result-rca-cross",
        kind: "tool-result",
        delayMs: 500,
        text: "booking-api's /checkout/quote endpoint p95 latency rose from 180ms to 2.1s starting 3 days ago",
      },
      {
        id: "answer-rca",
        kind: "answer",
        delayMs: 800,
        text: "It's not a flaky test — it's a real regression in booking-api. A caching layer on /checkout/quote appears to have been removed or is misconfigured; the timeout is a symptom, not the cause. I'd fix the backend latency rather than extend the test's timeout, which would just hide the regression.",
      },
    ];
  }

  if (AUTO_HEAL_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      { id: "tool-heal", kind: "tool", delayMs: 500, text: "Ordino(scan-for-selector-drift)" },
      {
        id: "tool-result-heal",
        kind: "tool-result",
        delayMs: 500,
        text: 'checkout-payment.e2e.spec.ts — button label changed from "Pay now" to "Complete purchase" 2 days ago',
      },
      {
        id: "tool-heal-fix",
        kind: "tool",
        delayMs: 500,
        text: "Auto-healing selector: getByText('Pay now') → getByText('Complete purchase')",
      },
      {
        id: "answer-heal",
        kind: "answer",
        delayMs: 800,
        text: "Healed automatically — no human review needed for a label-only change like this. Logged for audit: 1 test healed, 0 tests still flaky from this cause. I'll flag it for a human if the same selector needs healing more than twice in 30 days, since that usually means the UI is genuinely unstable, not just renamed.",
      },
    ];
  }

  if (REQUIREMENT_ANALYSIS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      { id: "tool-req-jira", kind: "tool", delayMs: 500, text: "Jira(fetch BOOK-510)" },
      {
        id: "tool-result-req-jira",
        kind: "tool-result",
        delayMs: 500,
        text: '"As a guest, I can redeem loyalty points at checkout to reduce my total." — 1 acceptance criterion found',
      },
      {
        id: "tool-req-check",
        kind: "tool",
        delayMs: 500,
        text: "Ordino(check-requirement-completeness --issue=BOOK-510)",
      },
      {
        id: "answer-req",
        kind: "answer",
        delayMs: 800,
        text: "Not quite ready — BOOK-510 has only one acceptance criterion, and it doesn't say what happens to redeemed points on a refund, whether there's a maximum redemption percentage, or how it interacts with a promo code applied to the same order. I'd get those three answered before development starts — ambiguous requirements like this are a documented source of downstream rework.",
      },
    ];
  }

  if (GENERATE_TESTS_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      { id: "tool-gen-jira", kind: "tool", delayMs: 500, text: "Jira(fetch BOOK-482)" },
      {
        id: "tool-result-gen-jira",
        kind: "tool-result",
        delayMs: 500,
        text: "Acceptance criteria: guest can search rooms, select dates, apply a promo code, and complete payment without errors",
      },
      {
        id: "tool-gen-launch",
        kind: "tool",
        delayMs: 600,
        text: "Browser(launch → https://staging.booking-website.dev)",
      },
      { id: "tool-result-gen-launch", kind: "tool-result", delayMs: 450, text: "Page loaded (200 OK)" },
      {
        id: "tool-gen-search",
        kind: "tool",
        delayMs: 500,
        text: "Browser(search rooms → dates: Aug 12–15)",
      },
      { id: "tool-result-gen-search", kind: "tool-result", delayMs: 400, text: "3 rooms found" },
      {
        id: "tool-gen-promo",
        kind: "tool",
        delayMs: 550,
        text: "Browser(select room → apply promo code SAVE20)",
      },
      {
        id: "tool-result-gen-promo",
        kind: "tool-result",
        delayMs: 450,
        text: "Discount applied — total updated to $86.40",
      },
      { id: "tool-gen-pay", kind: "tool", delayMs: 550, text: "Browser(complete payment)" },
      {
        id: "tool-result-gen-pay",
        kind: "tool-result",
        delayMs: 450,
        text: "Booking confirmed — confirmation #BW-10493",
      },
      {
        id: "tool-gen-write",
        kind: "tool",
        delayMs: 600,
        text: "Ordino(generate-playwright-spec --from-recording)",
      },
      {
        id: "tool-result-gen-write",
        kind: "tool-result",
        delayMs: 500,
        text: "Wrote e2e/booking-flow.e2e.spec.ts (64 lines)",
      },
      { id: "tool-gen-run", kind: "tool", delayMs: 600, text: "Bash(npx playwright test booking-flow)" },
      { id: "tool-result-gen-run", kind: "tool-result", delayMs: 500, text: "1 passed (7.8s)" },
      {
        id: "traceability-gen",
        kind: "traceability",
        delayMs: 700,
        text: "BOOK-482 → e2e/booking-flow.e2e.spec.ts — all 4 acceptance criteria covered.",
      },
      {
        id: "answer-gen",
        kind: "answer",
        delayMs: 700,
        text: "Done — walked the live booking flow end to end and generated e2e/booking-flow.e2e.spec.ts from it, replacing the flaky version flagged earlier. It's traced back to BOOK-482, so if that requirement changes, you'll know exactly which test to revisit.",
      },
    ];
  }

  if (COVERAGE_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-coverage",
        kind: "tool",
        delayMs: 500,
        text: "Checking coverage snapshot for booking-website…",
      },
      {
        id: "tool-result-coverage",
        kind: "tool-result",
        delayMs: 400,
        text: "71% overall (+5 pts vs last week)",
      },
      {
        id: "answer-coverage",
        kind: "answer",
        delayMs: 700,
        text: "Coverage is at 71%, up 5 points over the last week — climbing steadily from 65% five weeks ago. Breakdown: Unit 83%, Integration 68%, Front-end 55%. Front-end is the weakest spot if you're looking for where to invest next.",
      },
    ];
  }

  if (FLAKY_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-flaky",
        kind: "tool",
        delayMs: 500,
        text: "Scanning latest test runs…",
      },
      {
        id: "tool-result-flaky",
        kind: "tool-result",
        delayMs: 400,
        text: "booking-flow.e2e.spec.ts failed 11/14 an hour ago — 3 tests flagged flaky",
      },
      {
        id: "answer-flaky",
        kind: "answer",
        delayMs: 700,
        text: "Yes — booking-flow.e2e.spec.ts failed 11/14 about an hour ago, and 3 of those are flaky rather than real regressions. Flaky rate across the suite is 3.8%. Worth quarantining or fixing those 3 before they erode trust in the rest of the suite.",
      },
    ];
  }

  if (BUILD_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-build",
        kind: "tool",
        delayMs: 500,
        text: "Checking CI history…",
      },
      {
        id: "tool-result-build",
        kind: "tool-result",
        delayMs: 400,
        text: "94% build success rate",
      },
      {
        id: "answer-build",
        kind: "answer",
        delayMs: 700,
        text: "Build success rate is 94% over recent runs. The one recent failure was booking-flow.e2e.spec.ts (11/14 passed), tied to the 3 flaky tests already flagged — not a real regression.",
      },
    ];
  }

  if (FAILING_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-failing",
        kind: "tool",
        delayMs: 500,
        text: "Scanning latest test runs…",
      },
      {
        id: "tool-result-failing",
        kind: "tool-result",
        delayMs: 400,
        text: "booking-flow.e2e.spec.ts — 11/14 passed, 1 hour ago",
      },
      {
        id: "answer-failing",
        kind: "answer",
        delayMs: 700,
        text: "booking-flow.e2e.spec.ts is the one red suite right now — 11/14 passed an hour ago. 3 of the failures are already flagged as flaky, not new regressions. Everything else in the latest run (pricing, checkout, auth, shared-components) is green.",
      },
    ];
  }

  if (SAFE_TO_SHIP_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-safe",
        kind: "tool",
        delayMs: 500,
        text: "Checking coverage, build health, and cross-repo impact…",
      },
      {
        id: "tool-result-safe",
        kind: "tool-result",
        delayMs: 400,
        text: "Coverage 71% · Build success 94% · 1 open cross-repo risk",
      },
      {
        id: "answer-safe",
        kind: "answer",
        delayMs: 700,
        text: "Mostly, with one flag: coverage (71%) and build success (94%) both look healthy and trending up, but calculateTotal() in src/lib/pricing.ts is also called by booking-api's /checkout/quote endpoint, which has no test covering the promo-code + tax path your recent change touched. I'd close that gap before shipping.",
      },
    ];
  }

  if (RISK_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return [
      {
        id: "tool-risk",
        kind: "tool",
        delayMs: 500,
        text: "Checking cross-repo impact…",
      },
      {
        id: "tool-result-risk",
        kind: "tool-result",
        delayMs: 400,
        text: "calculateTotal() is used by booking-api (../booking-api/src/quote.ts)",
      },
      {
        id: "answer-risk",
        kind: "answer",
        delayMs: 700,
        text: "booking-api's /checkout/quote endpoint calls calculateTotal() from src/lib/pricing.ts, but that repo has no test for the promo-code + tax case your recent change affects. That's the biggest risk I see right now — everything else (coverage, build) is trending in the right direction.",
      },
    ];
  }

  return [
    {
      id: "answer-fallback",
      kind: "answer",
      delayMs: 700,
      text: "I can help with test coverage, flaky tests, build health, what's failing, or whether this repo is safe to ship — try asking about one of those.",
    },
  ];
}
