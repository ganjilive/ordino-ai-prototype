import { autoHealingSteps } from "@/lib/ide/auto-healing-fixture";
import { bugFixture } from "@/lib/ide/bug-fixture";
import { impactAnalysisSteps } from "@/lib/ide/impact-analysis-fixture";
import { requirementAnalysisSteps } from "@/lib/ide/requirement-analysis-fixture";
import { testAutomationSteps } from "@/lib/ide/test-automation-fixture";
import { testPlanningSteps } from "@/lib/ide/test-planning-fixture";
import type { IdeScriptedStep } from "@/lib/ide/types";

const BUG_KEYWORDS = [
  "promo",
  "discount",
  "total",
  "checkout",
  "tax",
  "bug",
  "price",
  "pricing",
  "wrong",
  "overcharg",
];

export interface IdeRoutedResponse {
  steps: IdeScriptedStep[];
}

export function routeIdeMessage(message: string): IdeRoutedResponse {
  const normalized = message.toLowerCase();

  const matchesRequirementAnalysis =
    normalized.includes("book-510") ||
    normalized.includes("ready for development") ||
    normalized.includes("acceptance criteria");
  if (matchesRequirementAnalysis) {
    return { steps: requirementAnalysisSteps };
  }

  const matchesTestPlanning =
    normalized.includes("how should we test") || normalized.includes("test plan");
  if (matchesTestPlanning) {
    return { steps: testPlanningSteps };
  }

  const matchesAutoHealing =
    normalized.includes("auto-heal") || normalized.includes("selector drift");
  if (matchesAutoHealing) {
    return { steps: autoHealingSteps };
  }

  const matchesTestAutomation =
    normalized.includes("update tests and execute") ||
    (normalized.includes("finished developing") && normalized.includes("test"));
  if (matchesTestAutomation) {
    return { steps: testAutomationSteps };
  }

  const matchesImpactAnalysis =
    normalized.includes("dependent areas") ||
    (normalized.includes("identify") && normalized.includes("tested"));
  if (matchesImpactAnalysis) {
    return { steps: impactAnalysisSteps };
  }

  const matchesBug = BUG_KEYWORDS.some((keyword) => normalized.includes(keyword));
  if (matchesBug) {
    return {
      steps: [
        {
          delayMs: 900,
          content:
            "Looked at src/components/checkout/order-summary.tsx and src/lib/pricing.ts. Found it — calculateTotal() computes sales tax on the full subtotal before the promo discount is subtracted, so any order with a promo code applied overpays tax. I don't edit code myself, but here's a fix you can hand to a coding agent:",
          fix: {
            explanation: bugFixture.explanation,
            prompt: bugFixture.prompt,
          },
        },
      ],
    };
  }

  return {
    steps: [
      {
        delayMs: 900,
        content:
          "I can help with that once I've looked at the right files — try asking me about the checkout total or promo code issue that's been reported for this project.",
      },
    ],
  };
}
