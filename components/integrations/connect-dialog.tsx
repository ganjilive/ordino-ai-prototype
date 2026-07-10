"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrdinoStore } from "@/lib/store";
import type { Integration } from "@/lib/types";

export function ConnectDialog({
  integration,
  open,
  onOpenChange,
}: {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [token, setToken] = useState("");
  const connectIntegration = useOrdinoStore((state) => state.connectIntegration);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    connectIntegration(integration.id, token.trim() || `${integration.name} workspace`);
    setToken("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Connect {integration.name}</DialogTitle>
            <DialogDescription>
              This is a simulated connection for the prototype — no real credentials are sent
              anywhere.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Label htmlFor="integration-token">Workspace / API token</Label>
            <Input
              id="integration-token"
              placeholder={`e.g. ${integration.name.toLowerCase()}-workspace`}
              value={token}
              onChange={(event) => setToken(event.target.value)}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="ordino-gradient-bg text-white hover:opacity-90">
              Connect
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
