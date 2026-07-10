import { BarChart3 } from "lucide-react";

export function QualityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <BarChart3 className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-medium">No quality data yet for this project</p>
      <p className="text-sm text-muted-foreground">
        Connect a CI integration to start seeing test runs and coverage here.
      </p>
    </div>
  );
}
