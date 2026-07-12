"use client";

import { Switch } from "@/components/ui/switch";
import { useOrdinoStore } from "@/lib/store";

export function MergePolicyToggle({ projectId }: { projectId: string }) {
  const required = useOrdinoStore((state) => state.requireVerificationPolicy[projectId] ?? false);
  const setRequireVerificationPolicy = useOrdinoStore((state) => state.setRequireVerificationPolicy);

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <div>
        <div className="text-sm font-medium">Require Ordino verification before merging agent PRs</div>
        <p className="text-xs text-muted-foreground">
          {required
            ? "Merging is blocked while Ordino finds an unresolved regression."
            : "Advisory only — Ordino's findings don't block merging yet."}
        </p>
      </div>
      <Switch
        checked={required}
        onCheckedChange={(checked) => setRequireVerificationPolicy(projectId, checked)}
      />
    </div>
  );
}
