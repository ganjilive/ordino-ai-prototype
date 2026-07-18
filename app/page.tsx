import type { Metadata } from "next";
import { Bot, Code2, FileText, FlaskConical, Megaphone, Monitor, SquareTerminal } from "lucide-react";

import { ProductSurfaceCard } from "@/components/home/product-surface-card";

export const metadata: Metadata = {
  title: "Ordino Research and Design Ideas",
};

const MAIN_OPTIONS = [
  {
    href: "/research-findings.html",
    icon: FlaskConical,
    title: "Research Findings",
    description: "What the research points to — competitive landscape and validated customer problems.",
    cta: "Read the research",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "/design-brief.html",
    icon: FileText,
    title: "Design Brief",
    description: "What ideas we have for the product now — positioning, capabilities, and architecture.",
    cta: "Read the design brief",
    target: "_blank",
    rel: "noopener noreferrer",
  },
  {
    href: "/marketing",
    icon: Megaphone,
    title: "Marketing Page",
    description: "How we intend to position the product in the market.",
    cta: "View the marketing page",
  },
] as const;

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
    <div className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Ordino Research and Design Ideas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start here: what the research found, what we&apos;re proposing for the product, and
          how we&apos;d pitch it.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
        {MAIN_OPTIONS.map((option) => (
          <ProductSurfaceCard key={option.href} {...option} size="lg" />
        ))}
      </div>

      <div className="mt-16 border-t border-border pt-10">
        <h2 className="text-lg font-semibold">Prototypes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Four design suggestions for how someone might interact with Ordino day to day. Pick
          one to explore.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCT_SURFACES.map((surface) => (
            <ProductSurfaceCard key={surface.href} {...surface} />
          ))}
        </div>
      </div>
    </div>
  );
}
