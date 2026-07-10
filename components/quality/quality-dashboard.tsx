import { CoverageByTypeChart } from "@/components/quality/coverage-by-type-chart";
import { CoverageTrendChart } from "@/components/quality/coverage-trend-chart";
import { StatTile } from "@/components/quality/stat-tile";
import { TestRunList } from "@/components/quality/test-run-list";
import type { ProjectQualitySnapshot } from "@/lib/mock-data/quality";

export function QualityDashboard({ snapshot }: { snapshot: ProjectQualitySnapshot }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Overall coverage"
          value={`${snapshot.overallCoverage}%`}
          delta={`+${snapshot.coverageDelta}pts`}
        />
        <StatTile label="Build success rate" value={`${snapshot.buildSuccessRate}%`} />
        <StatTile label="Flaky test rate" value={`${snapshot.flakyTestRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CoverageTrendChart points={snapshot.coverageTrend} />
        <CoverageByTypeChart data={snapshot.coverageByType} />
      </div>

      <TestRunList runs={snapshot.latestRuns} />
    </div>
  );
}
