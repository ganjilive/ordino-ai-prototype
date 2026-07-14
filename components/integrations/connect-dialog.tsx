"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { githubOrgRepos } from "@/lib/mock-data/github-repos";
import { useOrdinoStore } from "@/lib/store";
import type { Integration } from "@/lib/types";

const GITHUB_ORG = "ordino-labs";

function GithubRepoPickerDialog({
  integration,
  onOpenChange,
}: {
  integration: Integration;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(githubOrgRepos.filter((repo) => repo.preselected).map((repo) => repo.fullName)),
  );
  const connectIntegration = useOrdinoStore((state) => state.connectIntegration);

  function toggleRepo(fullName: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(fullName)) {
        next.delete(fullName);
      } else {
        next.add(fullName);
      }
      return next;
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    connectIntegration(integration.id, GITHUB_ORG, Array.from(selected));
    onOpenChange(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Grant Ordino access to repositories</DialogTitle>
        <DialogDescription>
          Choose which repositories in {GITHUB_ORG} Ordino can read and run tests in. For repos
          your team owns, Ordino can commit changes directly; for repos owned by other teams,
          Ordino opens a PR for their review instead. This is a simulated connection for the
          prototype — no real credentials are sent anywhere.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-2 py-4">
        {githubOrgRepos.map((repo) => (
          <label
            key={repo.fullName}
            className="flex items-start gap-2.5 rounded-md border border-border p-2.5 text-sm hover:bg-accent/50"
          >
            <input
              type="checkbox"
              checked={selected.has(repo.fullName)}
              onChange={() => toggleRepo(repo.fullName)}
              className="mt-0.5 h-4 w-4 shrink-0"
            />
            <span>
              <span className="flex items-center gap-1.5">
                <span className="font-medium">{repo.fullName}</span>
                <Badge variant={repo.ownedByYourTeam ? "secondary" : "outline"}>
                  {repo.ownedByYourTeam ? "Your team" : "Other team"}
                </Badge>
              </span>
              <span className="block text-xs text-muted-foreground">{repo.description}</span>
            </span>
          </label>
        ))}
      </div>
      <DialogFooter>
        <Button
          type="submit"
          disabled={selected.size === 0}
          className="ordino-gradient-bg text-white hover:opacity-90"
        >
          Grant access
        </Button>
      </DialogFooter>
    </form>
  );
}

function GenericConnectDialog({
  integration,
  onOpenChange,
}: {
  integration: Integration;
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
  );
}

export function ConnectDialog({
  integration,
  open,
  onOpenChange,
}: {
  integration: Integration;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {integration.type === "github" ? (
          <GithubRepoPickerDialog integration={integration} onOpenChange={onOpenChange} />
        ) : (
          <GenericConnectDialog integration={integration} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}
