"use client";

import { IntegrationCard } from "@/components/integrations/integration-card";
import { useOrdinoStore } from "@/lib/store";

export default function IntegrationsPage() {
  const integrations = useOrdinoStore((state) => state.integrations);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-xl font-semibold">Integrations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Connect the tools your team already uses so Ordino&apos;s agents can work with real context.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
