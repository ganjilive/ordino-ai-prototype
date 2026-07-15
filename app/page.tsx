import { Bot, Code2, Monitor, SquareTerminal } from "lucide-react";

import { ProductSurfaceCard } from "@/components/home/product-surface-card";

const PRODUCT_SURFACES = [
  {
    href: "/chat",
    icon: Monitor,
    title: "Desktop App",
    description:
      "The full Ordino workspace — projects, chat, integrations, and quality dashboards in one dashboard shell.",
    cta: "Open desktop app",
  },
  {
    href: "/ide",
    icon: Code2,
    title: "VS Code Extension",
    description:
      "Ordino embedded in the editor — investigates a bug, hands off a fix prompt, and verifies the flows it touches before a PR opens.",
    cta: "Open VS Code extension",
  },
  {
    href: "/terminal",
    icon: SquareTerminal,
    title: "Terminal",
    description:
      "Ordino Terminal Companion — watches your repo, runs local checks, and proactively flags cross-repo risk while you work.",
    cta: "Open terminal",
  },
  {
    href: "/agent",
    icon: Bot,
    title: "Coding Agent",
    description:
      "Claude Code working a task, calling out to Ordino mid-flight to check cross-repo impact before it finishes.",
    cta: "Open coding agent demo",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Ordino</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Four product-surface ideas for the same concept. Pick one to demo.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_SURFACES.map((surface) => (
          <ProductSurfaceCard key={surface.href} {...surface} />
        ))}
      </div>
    </div>
  );
}
