import type { CoverageByType } from "@/lib/mock-data/quality";

export function CoverageByTypeChart({ data }: { data: CoverageByType[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Coverage by type</h3>
      <div className="mt-3 flex flex-col gap-3">
        {sorted.map((item) => (
          <div key={item.type}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.type}</span>
              <span className="font-medium text-foreground">{item.value}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full"
                style={{ width: `${item.value}%`, backgroundColor: "var(--ordino-orange)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
