"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useOrdinoStore } from "@/lib/store";

export default function SettingsPage() {
  const theme = useOrdinoStore((state) => state.theme);
  const toggleTheme = useOrdinoStore((state) => state.toggleTheme);
  const teamMembers = useOrdinoStore((state) => state.teamMembers);
  const you = teamMembers.find((member) => member.id === "member-you");

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="text-xl font-semibold">Settings</h1>

      <section className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Account</h2>
        {you && (
          <div className="mt-3 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-white" style={{ backgroundColor: you.avatarColor }}>
                {you.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{you.name}</p>
              <p className="text-xs text-muted-foreground">{you.email}</p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Appearance</h2>
        <div className="mt-3 flex items-center justify-between">
          <Label htmlFor="dark-mode-toggle" className="text-sm text-muted-foreground">
            Dark mode
          </Label>
          <Switch
            id="dark-mode-toggle"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
        </div>
      </section>
    </div>
  );
}
