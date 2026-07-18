import { Bot, Code2, FileText, FlaskConical, Megaphone, Monitor, SquareTerminal } from "lucide-react";

import { ProductSurfaceCard } from "@/components/home/product-surface-card";
import { buttonVariants } from "@/components/ui/button";

const PRODUCT_SURFACES = [
  {
    href: "/chat",
    icon: Monitor,
    title: "Desktop/Web App",
    description: "Projects, chat, and quality dashboards in one workspace.",
    cta: "Open desktop app",
  },
  {
    href: "/ide",
    icon: Code2,
    title: "VS Code Extension",
    description: "Ordino in the editor, verifying fixes before a PR opens.",
    cta: "Open VS Code extension",
  },
  {
    href: "/terminal",
    icon: SquareTerminal,
    title: "Terminal",
    description: "Watches your repo and flags cross-repo risk as you work.",
    cta: "Open terminal",
  },
  {
    href: "/agent",
    icon: Bot,
    title: "Coding Agent",
    description: "Claude Code calling Ordino mid-task to check cross-repo impact.",
    cta: "Open coding agent demo",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-16">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Ordino</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Four product-surface ideas for the same concept. Pick one to demo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/research-findings.html"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <FlaskConical className="h-4 w-4" />
            Research Findings
          </a>
          <a
            href="/design-brief.html"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            <FileText className="h-4 w-4" />
            Read the Design Brief
          </a>
          <a
            href="/marketing"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            <Megaphone className="h-4 w-4" />
            View Marketing Page
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PRODUCT_SURFACES.map((surface) => (
          <ProductSurfaceCard key={surface.href} {...surface} />
        ))}
      </div>
    </div>
  );
}
