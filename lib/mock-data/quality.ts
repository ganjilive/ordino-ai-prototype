export type TestType = "Unit" | "Integration" | "Front-end";

export interface CoverageTrendPoint {
  label: string;
  value: number;
}

export interface CoverageByType {
  type: TestType;
  value: number;
}

export type TestRunStatus = "passed" | "failed";

export interface TestRun {
  id: string;
  suite: string;
  testType: Extract<TestType, "Unit" | "Integration">;
  status: TestRunStatus;
  passedCount: number;
  totalCount: number;
  ranAgo: string;
  note?: string;
}

export interface ProjectQualitySnapshot {
  overallCoverage: number;
  coverageDelta: number;
  buildSuccessRate: number;
  flakyTestRate: number;
  coverageTrend: CoverageTrendPoint[];
  coverageByType: CoverageByType[];
  latestRuns: TestRun[];
}

export const qualitySnapshots: Record<string, ProjectQualitySnapshot> = {
  "proj-booking-website": {
    overallCoverage: 71,
    coverageDelta: 5,
    buildSuccessRate: 94,
    flakyTestRate: 3.8,
    coverageTrend: [
      { label: "5 wks ago", value: 65 },
      { label: "4 wks ago", value: 66 },
      { label: "3 wks ago", value: 67 },
      { label: "2 wks ago", value: 68 },
      { label: "1 wk ago", value: 70 },
      { label: "Now", value: 71 },
    ],
    coverageByType: [
      { type: "Unit", value: 83 },
      { type: "Integration", value: 68 },
      { type: "Front-end", value: 55 },
    ],
    latestRuns: [
      {
        id: "run-1",
        suite: "src/lib/pricing.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 6,
        totalCount: 6,
        ranAgo: "2 minutes ago",
      },
      {
        id: "run-2",
        suite: "checkout.e2e.spec.ts",
        testType: "Integration",
        status: "passed",
        passedCount: 14,
        totalCount: 14,
        ranAgo: "18 minutes ago",
      },
      {
        id: "run-3",
        suite: "booking-flow.e2e.spec.ts",
        testType: "Integration",
        status: "failed",
        passedCount: 11,
        totalCount: 14,
        ranAgo: "1 hour ago",
        note: "3 tests flaky in this suite",
      },
      {
        id: "run-4",
        suite: "auth.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 22,
        totalCount: 22,
        ranAgo: "3 hours ago",
      },
      {
        id: "run-5",
        suite: "shared-components.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 9,
        totalCount: 9,
        ranAgo: "5 hours ago",
      },
    ],
  },
};

export function getQualitySnapshot(projectId: string): ProjectQualitySnapshot | undefined {
  return qualitySnapshots[projectId];
}
