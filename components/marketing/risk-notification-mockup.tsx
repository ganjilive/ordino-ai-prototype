import { Badge } from "@/components/ui/badge";

export function RiskNotificationMockup() {
  return (
    <div className="max-w-lg rounded-lg border border-border border-l-4 border-l-destructive bg-card p-4">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          O
        </div>
        <span className="text-sm font-semibold">Ordino</span>
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          APP
        </span>
        <span className="text-xs text-muted-foreground">10:42 AM</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        <span className="font-semibold">
          Risk flag — PR #482 &quot;Refactor payment gateway client&quot;
        </span>
        <br />
        This change touches shared code used by 3 other repos: checkout-service,
        notifications-service, billing-service. Test coverage for the affected
        functions is 41%.
      </p>
      <div className="mt-2">
        <Badge variant="destructive">High risk</Badge>
      </div>
      <div className="mt-3 flex gap-2">
        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          View PR
        </span>
        <span className="rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground">
          View full report
        </span>
      </div>
    </div>
  );
}
