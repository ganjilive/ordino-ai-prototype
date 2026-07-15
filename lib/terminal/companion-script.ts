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
  "What's our test coverage?",
  "Any flaky tests?",
  "Is this safe to ship?",
];

const COVERAGE_KEYWORDS = ["coverage", "tested"];
const FLAKY_KEYWORDS = ["flaky", "flake"];
const BUILD_KEYWORDS = ["build", "ci", "pipeline"];
const FAILING_KEYWORDS = ["failing", "failed", "broke", "broken", "red"];
const SAFE_TO_SHIP_KEYWORDS = ["safe", "ship", "merge", "release", "ready"];
const RISK_KEYWORDS = ["risk", "worried", "worry", "cross-repo", "booking-api"];

export function answerQuestion(question: string): TerminalCompanionStep[] {
  const normalized = question.toLowerCase();

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
