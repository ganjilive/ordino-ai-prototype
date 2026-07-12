export interface UserFlowCheck {
  id: string;
  flowName: string;
  status: "passed" | "failed";
  steps: string[];
  finding?: string;
}

export interface FileChange {
  path: string;
  additions: number;
  deletions: number;
}

export interface PullRequest {
  id: string;
  projectId: string;
  number: number;
  title: string;
  author: string;
  branch: string;
  createdAgo: string;
  filesChanged: FileChange[];
  ciStatus: "passed";
  verdict: "safe_to_merge" | "regression_found";
  summary: string;
  flows: UserFlowCheck[];
  fixPrompt?: string;
  preVerified?: boolean;
}

export const pullRequests: PullRequest[] = [
  {
    id: "pr-tax-discount-order",
    projectId: "proj-booking-website",
    number: 490,
    title: "Fix tax calculated before discount",
    author: "Cascade Agent",
    preVerified: true,
    branch: "agent/tax-discount-order-fix",
    createdAgo: "5 minutes ago",
    filesChanged: [
      { path: "src/lib/pricing.ts", additions: 4, deletions: 2 },
      { path: "src/emails/order-confirmation.ts", additions: 3, deletions: 1 },
    ],
    ciStatus: "passed",
    verdict: "safe_to_merge",
    summary:
      "Ordino verified this PR's impacted flows before it was ever opened — the coding agent's own pre-PR check caught a stale total in the order confirmation email and fixed it before requesting review.",
    flows: [
      {
        id: "flow-guest-checkout-tax-discount",
        flowName: "Guest checkout, single item, no promo code",
        status: "passed",
        steps: [
          "Add one item to cart",
          "Proceed to checkout as guest",
          "Confirm order total and confirmation email match",
        ],
      },
      {
        id: "flow-returning-customer-promo-tax",
        flowName: "Returning customer checkout, promo code applied",
        status: "passed",
        steps: [
          "Sign in as returning customer",
          "Apply promo code SAVE10",
          "Confirm checkout total reflects tax computed after the discount",
        ],
      },
      {
        id: "flow-order-confirmation-email-tax",
        flowName: "Order confirmation email after a promo-code checkout",
        status: "passed",
        steps: [
          "Complete checkout with a promo code applied",
          "Open the order confirmation email",
          "Confirm the email's total matches the discounted, correctly-taxed checkout total",
        ],
      },
    ],
  },
  {
    id: "pr-gift-card-checkout",
    projectId: "proj-booking-website",
    number: 482,
    title: "Add gift card redemption at checkout",
    author: "Cascade Agent",
    branch: "agent/gift-card-redemption",
    createdAgo: "42 minutes ago",
    filesChanged: [
      { path: "src/lib/pricing.ts", additions: 38, deletions: 6 },
      { path: "src/components/checkout/order-summary.tsx", additions: 21, deletions: 4 },
      { path: "src/components/checkout/gift-card-input.tsx", additions: 57, deletions: 0 },
    ],
    ciStatus: "passed",
    verdict: "regression_found",
    summary:
      "Unit tests and lint are green, but running the checkout flows that combine a gift card with a promo code turns up a pricing bug CI never exercised.",
    flows: [
      {
        id: "flow-guest-checkout",
        flowName: "Guest checkout, single item, no codes",
        status: "passed",
        steps: [
          "Add one item to cart",
          "Proceed to checkout as guest",
          "Confirm order total matches item price plus tax",
        ],
      },
      {
        id: "flow-promo-only",
        flowName: "Apply promo code only",
        status: "passed",
        steps: [
          "Add item to cart",
          "Apply promo code SAVE10",
          "Confirm discount is applied before tax",
        ],
      },
      {
        id: "flow-gift-card-only",
        flowName: "Redeem gift card only",
        status: "passed",
        steps: [
          "Add item to cart",
          "Redeem gift card for full balance",
          "Confirm gift card balance is deducted from the total",
        ],
      },
      {
        id: "flow-promo-and-gift-card",
        flowName: "Apply promo code + redeem gift card together",
        status: "failed",
        steps: [
          "Add item to cart",
          "Apply promo code SAVE10",
          "Redeem gift card for part of the remaining balance",
          "Confirm final total reflects both the promo discount and the gift card",
        ],
        finding:
          "The gift card balance is deducted from the subtotal before the promo discount is applied, instead of after. When both are used together, the customer is overcharged by the discount amount — a $10 promo code effectively becomes worthless whenever a gift card is also applied.",
      },
    ],
    fixPrompt:
      "In src/lib/pricing.ts, calculateTotal() currently deducts the gift card amount before applying the promo discount. Apply the promo discount to the subtotal first, then deduct the gift card amount from the discounted total. Update src/lib/pricing.test.ts to cover a case where a promo code and a gift card are both applied in the same order.",
  },
  {
    id: "pr-loyalty-points-confirmation",
    projectId: "proj-booking-website",
    number: 486,
    title: "Add loyalty points display on order confirmation",
    author: "Relay Agent",
    branch: "agent/loyalty-points-confirmation",
    createdAgo: "3 hours ago",
    filesChanged: [
      { path: "src/components/checkout/order-confirmation.tsx", additions: 24, deletions: 2 },
      { path: "src/lib/loyalty.ts", additions: 19, deletions: 0 },
    ],
    ciStatus: "passed",
    verdict: "safe_to_merge",
    summary:
      "All impacted checkout flows were re-run against this change and none of them regressed — the new loyalty points line only affects the confirmation screen.",
    flows: [
      {
        id: "flow-guest-checkout-confirmation",
        flowName: "Guest checkout, single item, no codes",
        status: "passed",
        steps: [
          "Complete guest checkout for one item",
          "Confirm order confirmation screen renders",
          "Confirm no loyalty points line shown for guest checkout",
        ],
      },
      {
        id: "flow-signed-in-checkout-confirmation",
        flowName: "Signed-in checkout earns loyalty points",
        status: "passed",
        steps: [
          "Complete checkout while signed in",
          "Confirm order confirmation screen shows points earned",
          "Confirm points total matches order subtotal at the existing 1pt-per-$1 rate",
        ],
      },
      {
        id: "flow-promo-checkout-confirmation",
        flowName: "Promo code checkout still totals correctly",
        status: "passed",
        steps: [
          "Complete checkout with a promo code applied",
          "Confirm order confirmation total matches the discounted amount",
          "Confirm loyalty points are calculated on the discounted subtotal, not the pre-discount price",
        ],
      },
    ],
  },
];

export function getPullRequestsForProject(projectId: string): PullRequest[] {
  return pullRequests.filter((pr) => pr.projectId === projectId);
}

export function getPullRequest(prId: string): PullRequest | undefined {
  return pullRequests.find((pr) => pr.id === prId);
}

export function getEffectiveVerdict(
  pr: PullRequest,
  dismissedFlowIds: string[],
): "safe_to_merge" | "regression_found" {
  const hasActiveFailure = pr.flows.some(
    (f) => f.status === "failed" && !dismissedFlowIds.includes(f.id),
  );
  return hasActiveFailure ? "regression_found" : "safe_to_merge";
}

export function countOverturnedFlows(pr: PullRequest, dismissedFlowIds: string[]): number {
  return pr.flows.filter((f) => f.status === "failed" && dismissedFlowIds.includes(f.id)).length;
}

export function countRegressionsCaught(pr: PullRequest): number {
  return pr.flows.filter((f) => f.status === "failed").length;
}

export function getProjectTrackRecord(projectId: string, dismissedFlowIds: string[]) {
  const prs = getPullRequestsForProject(projectId);
  return {
    verifiedCount: prs.length,
    caughtCount: prs.reduce((sum, pr) => sum + countRegressionsCaught(pr), 0),
    overturnedCount: prs.reduce((sum, pr) => sum + countOverturnedFlows(pr, dismissedFlowIds), 0),
  };
}

export interface AgentTrackRecord {
  agentName: string;
  verifiedCount: number;
  caughtCount: number;
  overturnedCount: number;
  cleanCount: number;
}

export function getAgentTrackRecords(projectId: string, dismissedFlowIds: string[]): AgentTrackRecord[] {
  const prs = getPullRequestsForProject(projectId);
  const byAgent = new Map<string, PullRequest[]>();
  for (const pr of prs) {
    byAgent.set(pr.author, [...(byAgent.get(pr.author) ?? []), pr]);
  }
  return Array.from(byAgent.entries()).map(([agentName, agentPrs]) => ({
    agentName,
    verifiedCount: agentPrs.length,
    caughtCount: agentPrs.reduce((sum, pr) => sum + countRegressionsCaught(pr), 0),
    overturnedCount: agentPrs.reduce((sum, pr) => sum + countOverturnedFlows(pr, dismissedFlowIds), 0),
    cleanCount: agentPrs.filter((pr) => getEffectiveVerdict(pr, dismissedFlowIds) === "safe_to_merge").length,
  }));
}
