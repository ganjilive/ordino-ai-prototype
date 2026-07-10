import type { CoverageTrendPoint } from "@/lib/mock-data/quality";

const WIDTH = 480;
const HEIGHT = 160;
const PADDING = 24;

export function CoverageTrendChart({ points }: { points: CoverageTrendPoint[] }) {
  const maxValue = 100;
  const minValue = Math.min(...points.map((p) => p.value)) - 5;
  const range = maxValue - minValue;
  const stepX = (WIDTH - PADDING * 2) / (points.length - 1);

  function toX(index: number) {
    return PADDING + index * stepX;
  }
  function toY(value: number) {
    return HEIGHT - PADDING - ((value - minValue) / range) * (HEIGHT - PADDING * 2);
  }

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(point.value)}`)
    .join(" ");

  const areaPath = `${linePath} L ${toX(points.length - 1)} ${HEIGHT - PADDING} L ${toX(0)} ${HEIGHT - PADDING} Z`;

  const latest = points[points.length - 1];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Coverage trend</h3>
        <span className="text-sm font-medium">{latest.value}%</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`Coverage trend, latest ${latest.value}%`}
      >
        <path d={areaPath} fill="var(--ordino-orange)" opacity={0.12} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--ordino-orange)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle key={point.label} cx={toX(index)} cy={toY(point.value)} r={3} fill="var(--ordino-orange)" />
        ))}
        <text
          x={toX(points.length - 1)}
          y={toY(latest.value) - 10}
          textAnchor="end"
          className="fill-foreground text-[11px] font-medium"
        >
          {latest.value}%
        </text>
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}
