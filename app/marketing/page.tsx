import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { RiskNotificationMockup } from "@/components/marketing/risk-notification-mockup";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { cn } from "@/lib/utils";

const STATS = [
  {
    value: "7,839",
    label: "lines of code / developer / month",
    sub: "up 76% in a year",
  },
  {
    value: "85%+",
    label: "of enterprise QA teams",
    sub: "say AI code generation has outpaced their ability to test it",
  },
  {
    value: "+199.6%",
    label: "median PR review time",
    sub: "under high AI adoption",
  },
] as const;

const SURFACES = [
  {
    title: "Direct use",
    description: "Chat, terminal, or IDE panel — the quality owner's own workspace.",
  },
  {
    title: "Background watcher",
    description:
      "Runs alongside the repo, notifies through Slack or PR comments — no new interface to check.",
  },
  {
    title: "Called by other agents",
    description: "Claude Code, Cursor, or any MCP-capable agent invokes Ordino mid-task.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "Test Automation",
    description: "Automate system tests in test environments — front-end, API, and integration.",
    core: false,
  },
  {
    title: "Root Cause Analysis",
    description: "Analyse failures, find the root cause, and recommend fixes.",
    core: false,
  },
  {
    title: "Test Authoring",
    description: "Write test cases so a requirement is properly tested before releasing.",
    core: true,
  },
  {
    title: "Test Planning",
    description:
      "Plan tests before a feature is built — how much developer testing, how much automated system testing.",
    core: false,
  },
  {
    title: "Auto Healing",
    description: "Heal flaky tests automatically so test suites don't rot.",
    core: false,
  },
  {
    title: "Requirement Analysis",
    description: "Refine requirements to make them testable and complete before development starts.",
    core: false,
  },
  {
    title: "Blast Radius Analysis",
    description: "Assess what tests to run depending on the changes done to the code.",
    core: true,
  },
] as const;

export default function MarketingPage() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="ordino-gradient-ring pointer-events-none absolute top-[-220px] left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        />
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            QA for the agentic era
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your agents ship code fast. Is your QA keeping up?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground">
            Ordino is the always-on QA teammate for the agentic era — it sees across every
            repo your team owns, catches what a change breaks before the PR exists, and does
            the testing work your team already does, just faster.
          </p>
          <div className="mt-8 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      {/* What */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          What is Ordino
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          QA, built for how software gets made now
        </h2>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground">
          Ordino is an always-on quality partner for whoever owns product quality — a QA
          engineer, tech lead, or release manager. It connects to the repos, requirements,
          test-management, and communication tools already in use, and takes on the actual
          work of testing: planning it, writing it, running it, and explaining why it broke.
        </p>
      </section>

      {/* Why */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Why it matters
          </span>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            AI writes code faster than anyone can verify it
          </h2>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-sm font-medium">{stat.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-2xl text-base text-muted-foreground">
            For a quality owner accountable for a product built across many repos, that
            bottleneck isn&apos;t backlog — it&apos;s blind spots. A developer changes one
            piece, and nothing tells the quality owner what else it touches, until CI fails
            somewhere else — often after they&apos;ve already signed off.
          </p>

          <div className="mt-6 max-w-2xl rounded-lg border border-border border-l-4 border-l-primary bg-card p-5">
            <h3 className="text-sm font-semibold">Isn&apos;t this just integration testing?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Integration tests only catch what someone already thought to test. The blind
              spot isn&apos;t a missing test suite — it&apos;s not knowing a change reaches
              into another repo at all, until it&apos;s already merged. Ordino surfaces that
              reach before the PR exists, including paths nobody flagged for coverage in the
              first place.
            </p>
          </div>

          <blockquote className="mt-8 max-w-2xl border-l-2 border-border pl-5 text-lg text-foreground italic">
            &quot;Before I approve this, I want to know what it actually touches — and
            whether it&apos;s covered.&quot;
            <footer className="mt-2 text-sm font-normal text-muted-foreground not-italic">
              The same blind spot developer interviews confirmed, now from the seat that has
              to approve it.
            </footer>
          </blockquote>

          <p className="mt-6 max-w-2xl text-base font-medium">
            That&apos;s the moment nothing else catches. Ordino is built to catch it before
            sign-off.
          </p>
        </div>
      </section>

      {/* How */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          How it works
        </span>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
          One QA teammate, wherever your team already works
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {SURFACES.map((surface) => (
            <div key={surface.title} className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">{surface.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{surface.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <RiskNotificationMockup />
          <p className="mt-2 text-xs text-muted-foreground italic">
            The background watcher in action — nobody asked, Ordino noticed.
          </p>
        </div>

        <p className="mt-10 max-w-2xl text-base text-muted-foreground">
          Ordino covers the QA work your team already does today — planning, authoring,
          automation, root cause analysis, and more — so quality keeps pace with how fast
          agents can now write code. Two capabilities carry the rest: blast radius analysis
          tells Ordino what&apos;s at risk, and test authoring writes the tests to cover it.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <div
              key={capability.title}
              className={cn(
                "rounded-lg border bg-card p-4",
                capability.core ? "border-primary" : "border-border",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{capability.title}</h3>
                {capability.core && (
                  <span className="ordino-gradient-text shrink-0 text-[10px] font-semibold tracking-wide uppercase">
                    Core
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{capability.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Be first to bring Ordino to your team
          </h2>
          <div className="mt-6 flex justify-center">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-6 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Ordino
        </Link>
      </footer>
    </div>
  );
}
