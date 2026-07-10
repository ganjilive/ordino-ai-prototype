"use client";

import { useState } from "react";

import { IntegrationIcon } from "@/components/integrations/integration-icon";
import { ConnectDialog } from "@/components/integrations/connect-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrdinoStore } from "@/lib/store";
import type { Integration } from "@/lib/types";

export function IntegrationCard({ integration }: { integration: Integration }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const disconnectIntegration = useOrdinoStore((state) => state.disconnectIntegration);
  const isConnected = integration.status === "connected";

  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
          <IntegrationIcon type={integration.type} className="h-4 w-4 text-muted-foreground" />
        </div>
        <Badge variant={isConnected ? "secondary" : "outline"} className="text-xs">
          {isConnected ? "Connected" : "Not connected"}
        </Badge>
      </div>

      <div className="mt-3">
        <h3 className="text-sm font-semibold">{integration.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{integration.description}</p>
        {isConnected && integration.accountLabel && (
          <p className="mt-2 truncate text-xs text-muted-foreground">
            {integration.accountLabel}
          </p>
        )}
      </div>

      <div className="mt-4">
        {isConnected ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => disconnectIntegration(integration.id)}
          >
            Disconnect
          </Button>
        ) : (
          <Button size="sm" className="w-full" onClick={() => setDialogOpen(true)}>
            Connect
          </Button>
        )}
      </div>

      <ConnectDialog integration={integration} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
