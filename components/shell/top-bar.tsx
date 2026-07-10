"use client";

import { Moon, SquareCode, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ProjectSwitcher } from "@/components/shell/project-switcher";
import { useOrdinoStore } from "@/lib/store";

export function TopBar() {
  const theme = useOrdinoStore((state) => state.theme);
  const toggleTheme = useOrdinoStore((state) => state.toggleTheme);
  const router = useRouter();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
      <ProjectSwitcher />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => router.push("/ide")}>
          <SquareCode className="h-4 w-4" />
          Open IDE
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
