"use client";

import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProjectSwitcher } from "@/components/shell/project-switcher";
import { useOrdinoStore } from "@/lib/store";

export function TopBar() {
  const theme = useOrdinoStore((state) => state.theme);
  const toggleTheme = useOrdinoStore((state) => state.toggleTheme);

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <ProjectSwitcher />
      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
