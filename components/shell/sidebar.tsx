"use client";

import { FolderKanban, MessageSquare, Plug, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoMark } from "@/components/shell/logo-mark";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useOrdinoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/workspace", label: "Workspace", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const teamMembers = useOrdinoStore((state) => state.teamMembers);
  const you = teamMembers.find((member) => member.id === "member-you");

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center px-4">
        <LogoMark />
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full ordino-gradient-bg" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {you && (
        <Link
          href="/workspace"
          className="mx-2 mb-2 flex items-center gap-2 rounded-md px-2.5 py-2 text-sm hover:bg-sidebar-accent/60"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback
              className="text-[10px] text-white"
              style={{ backgroundColor: you.avatarColor }}
            >
              {you.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <span className="truncate text-muted-foreground">{you.email}</span>
        </Link>
      )}
    </aside>
  );
}
