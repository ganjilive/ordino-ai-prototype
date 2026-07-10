# Project Quality Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a per-project page (`/projects/[projectId]`) showing a Quality Insight Dashboard (latest test runs, coverage trend, coverage by type) alongside a project-scoped Ordino chat panel, reusing the existing chat store and seed data rather than inventing a parallel system.

**Architecture:** A new dynamic route inside the existing `(shell)` route group renders two columns: a scrollable Quality Insight Dashboard (new mock-data module + hand-rolled SVG/CSS chart components, no new npm dependency) on the left, and a trimmed version of the existing chat system (same Zustand store, same `agent-router`, same `MessageList`/`EmptyState` components) scoped to the route's project on the right.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, existing shadcn-style `components/ui/*`, lucide-react, the existing `lib/store` Zustand store. No new dependencies.

## Global Constraints

- No new npm dependencies — charts are hand-rolled inline SVG/CSS, matching how the `/ide` scene was built.
- This repository has **no test runner configured** (`package.json` has no test script, no jest/vitest/playwright as a dependency). The verified working pattern for this codebase (used for the `/ide` feature) is: `npx tsc --noEmit` + `npm run lint` after each file, and a final Playwright-driven browser check via the cached `npx playwright` install at the end. Every task below uses this cycle in place of a unit-test cycle — there is no framework to write unit tests against.
- `params` is a `Promise` in this Next.js version (confirmed against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`); the new dynamic route page is a `"use client"` component that unwraps it with React's `use()`.
- Reuse existing store actions/components exactly as named: `useOrdinoStore` (`lib/store/index.ts`) exposes `projects`, `conversations`, `activeConversationId`, `setActiveProjectId`, `setActiveConversationId`, `sendMessage(projectId, content)`. `components/chat/empty-state.tsx` exports `EmptyState`, `components/chat/message-list.tsx` exports `MessageList`.
- Existing design tokens live in `app/globals.css` inside `:root`, `.dark`, and `@theme inline` blocks — follow that exact structure for the new `--success` token.
- Booking Website's project id is `proj-booking-website` (see `lib/mock-data/projects.ts`); only this project gets quality mock data.

---

### Task 1: Add the `--success` design token

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind utilities `text-success`, `bg-success`, `border-success` (via `--color-success`), usable by any later component.

- [ ] **Step 1: Add `--success` to `:root`**

In `app/globals.css`, find the `:root` block (starts at the line with `--background: oklch(0.99 0.003 75);`). Add this line immediately after `--ring: oklch(0.7 0.02 60);`:

```css
  --success: oklch(0.5 0.16 145);
```

- [ ] **Step 2: Add `--success` to `.dark`**

In the `.dark` block, add this line immediately after `--ring: oklch(0.55 0.01 60);`:

```css
  --success: oklch(0.72 0.17 145);
```

- [ ] **Step 3: Register the Tailwind utility**

In the `@theme inline { ... }` block, add this line immediately after `--color-ring: var(--ring);`:

```css
  --color-success: var(--success);
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit`
Expected: no output (no errors).

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "$(cat <<'EOF'
Add --success design token for pass/fail status

The palette had no green (deliberate — categorical identity is the
orange/pink/purple/blue Ordino gradient), but status color is reserved
and fixed per the dataviz skill, so pass/fail needs its own token.
Light value verified at 5.59:1 WCAG contrast against --card, dark at
7.61:1.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Create the quality mock-data module

**Files:**
- Create: `lib/mock-data/quality.ts`

**Interfaces:**
- Produces: `TestType`, `CoverageTrendPoint`, `CoverageByType`, `TestRunStatus`, `TestRun`, `ProjectQualitySnapshot` types; `getQualitySnapshot(projectId: string): ProjectQualitySnapshot | undefined`.

- [ ] **Step 1: Write the file**

```ts
export type TestType = "Unit" | "Integration" | "Front-end";

export interface CoverageTrendPoint {
  label: string;
  value: number;
}

export interface CoverageByType {
  type: TestType;
  value: number;
}

export type TestRunStatus = "passed" | "failed";

export interface TestRun {
  id: string;
  suite: string;
  testType: Extract<TestType, "Unit" | "Integration">;
  status: TestRunStatus;
  passedCount: number;
  totalCount: number;
  ranAgo: string;
  note?: string;
}

export interface ProjectQualitySnapshot {
  overallCoverage: number;
  coverageDelta: number;
  buildSuccessRate: number;
  flakyTestRate: number;
  coverageTrend: CoverageTrendPoint[];
  coverageByType: CoverageByType[];
  latestRuns: TestRun[];
}

export const qualitySnapshots: Record<string, ProjectQualitySnapshot> = {
  "proj-booking-website": {
    overallCoverage: 71,
    coverageDelta: 5,
    buildSuccessRate: 94,
    flakyTestRate: 3.8,
    coverageTrend: [
      { label: "5 wks ago", value: 65 },
      { label: "4 wks ago", value: 66 },
      { label: "3 wks ago", value: 67 },
      { label: "2 wks ago", value: 68 },
      { label: "1 wk ago", value: 70 },
      { label: "Now", value: 71 },
    ],
    coverageByType: [
      { type: "Unit", value: 83 },
      { type: "Integration", value: 68 },
      { type: "Front-end", value: 55 },
    ],
    latestRuns: [
      {
        id: "run-1",
        suite: "src/lib/pricing.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 6,
        totalCount: 6,
        ranAgo: "2 minutes ago",
      },
      {
        id: "run-2",
        suite: "checkout.e2e.spec.ts",
        testType: "Integration",
        status: "passed",
        passedCount: 14,
        totalCount: 14,
        ranAgo: "18 minutes ago",
      },
      {
        id: "run-3",
        suite: "booking-flow.e2e.spec.ts",
        testType: "Integration",
        status: "failed",
        passedCount: 11,
        totalCount: 14,
        ranAgo: "1 hour ago",
        note: "3 tests flaky in this suite",
      },
      {
        id: "run-4",
        suite: "auth.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 22,
        totalCount: 22,
        ranAgo: "3 hours ago",
      },
      {
        id: "run-5",
        suite: "shared-components.test.ts",
        testType: "Unit",
        status: "passed",
        passedCount: 9,
        totalCount: 9,
        ranAgo: "5 hours ago",
      },
    ],
  },
};

export function getQualitySnapshot(projectId: string): ProjectQualitySnapshot | undefined {
  return qualitySnapshots[projectId];
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/mock-data/quality.ts
git commit -m "$(cat <<'EOF'
Add quality mock data for the Booking Website project

Coverage trend/by-type/test-run numbers for the new project quality
dashboard. Overall coverage (71%, up from 66%) matches the existing
seed conversation so chat and dashboard never disagree; the top test
run is the same pricing.test.ts fix demonstrated in the /ide scene.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Create the `StatTile` component

**Files:**
- Create: `components/quality/stat-tile.tsx`

**Interfaces:**
- Consumes: nothing beyond React/Tailwind.
- Produces: `StatTile({ label: string; value: string; delta?: string }): JSX.Element`.

- [ ] **Step 1: Write the file**

```tsx
export function StatTile({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {delta && <span className="text-xs font-medium text-success">{delta}</span>}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/quality/stat-tile.tsx
git commit -m "$(cat <<'EOF'
Add StatTile component for the quality dashboard

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Create the coverage trend chart

**Files:**
- Create: `components/quality/coverage-trend-chart.tsx`

**Interfaces:**
- Consumes: `CoverageTrendPoint` from `@/lib/mock-data/quality`.
- Produces: `CoverageTrendChart({ points: CoverageTrendPoint[] }): JSX.Element`.

- [ ] **Step 1: Write the file**

```tsx
import type { CoverageTrendPoint } from "@/lib/mock-data/quality";

const WIDTH = 480;
const HEIGHT = 160;
const PADDING = 24;

export function CoverageTrendChart({ points }: { points: CoverageTrendPoint[] }) {
  const maxValue = 100;
  const minValue = Math.min(...points.map((p) => p.value)) - 5;
  const range = maxValue - minValue;
  const stepX = (WIDTH - PADDING * 2) / (points.length - 1);

  function toX(index: number) {
    return PADDING + index * stepX;
  }
  function toY(value: number) {
    return HEIGHT - PADDING - ((value - minValue) / range) * (HEIGHT - PADDING * 2);
  }

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${toX(index)} ${toY(point.value)}`)
    .join(" ");

  const areaPath = `${linePath} L ${toX(points.length - 1)} ${HEIGHT - PADDING} L ${toX(0)} ${HEIGHT - PADDING} Z`;

  const latest = points[points.length - 1];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold">Coverage trend</h3>
        <span className="text-sm font-medium">{latest.value}%</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="mt-2 w-full"
        role="img"
        aria-label={`Coverage trend, latest ${latest.value}%`}
      >
        <path d={areaPath} fill="var(--ordino-orange)" opacity={0.12} stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--ordino-orange)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((point, index) => (
          <circle key={point.label} cx={toX(index)} cy={toY(point.value)} r={3} fill="var(--ordino-orange)" />
        ))}
        <text
          x={toX(points.length - 1)}
          y={toY(latest.value) - 10}
          textAnchor="end"
          className="fill-foreground text-[11px] font-medium"
        >
          {latest.value}%
        </text>
      </svg>
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{points[0].label}</span>
        <span>{points[points.length - 1].label}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/quality/coverage-trend-chart.tsx
git commit -m "$(cat <<'EOF'
Add coverage trend chart

Single-hue line chart (trend-over-time job, one series so no legend
needed), direct-labeled with the latest value per the dataviz skill.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Create the coverage-by-type chart

**Files:**
- Create: `components/quality/coverage-by-type-chart.tsx`

**Interfaces:**
- Consumes: `CoverageByType` from `@/lib/mock-data/quality`.
- Produces: `CoverageByTypeChart({ data: CoverageByType[] }): JSX.Element`.

- [ ] **Step 1: Write the file**

```tsx
import type { CoverageByType } from "@/lib/mock-data/quality";

export function CoverageByTypeChart({ data }: { data: CoverageByType[] }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Coverage by type</h3>
      <div className="mt-3 flex flex-col gap-3">
        {sorted.map((item) => (
          <div key={item.type}>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{item.type}</span>
              <span className="font-medium text-foreground">{item.value}%</span>
            </div>
            <div className="mt-1 h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full"
                style={{ width: `${item.value}%`, backgroundColor: "var(--ordino-orange)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/quality/coverage-by-type-chart.tsx
git commit -m "$(cat <<'EOF'
Add coverage-by-type chart

Single-hue magnitude bars (compare-magnitude job) ordered high to low,
direct-labeled — not a categorical rainbow, since axis labels already
distinguish the three categories.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Create the test run list

**Files:**
- Create: `components/quality/test-run-list.tsx`

**Interfaces:**
- Consumes: `TestRun` from `@/lib/mock-data/quality`; `cn` from `@/lib/utils`.
- Produces: `TestRunList({ runs: TestRun[] }): JSX.Element`.

- [ ] **Step 1: Write the file**

```tsx
import { CheckCircle2, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TestRun } from "@/lib/mock-data/quality";

export function TestRunList({ runs }: { runs: TestRun[] }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Latest test runs</h3>
      <div className="mt-3 flex flex-col divide-y divide-border">
        {runs.map((run) => (
          <div
            key={run.id}
            className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{run.suite}</div>
              <div className="text-xs text-muted-foreground">
                {run.testType} · {run.ranAgo}
                {run.note ? ` · ${run.note}` : ""}
              </div>
            </div>
            <div
              className={cn(
                "flex shrink-0 items-center gap-1.5 text-xs font-medium",
                run.status === "passed" ? "text-success" : "text-destructive",
              )}
            >
              {run.status === "passed" ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
              ) : (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {run.status === "passed" ? "Passed" : "Failed"}
              <span className="text-muted-foreground">
                {run.passedCount}/{run.totalCount}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/quality/test-run-list.tsx
git commit -m "$(cat <<'EOF'
Add latest test runs list

Status uses the fixed --success/--destructive tokens, always paired
with an icon and label, never color alone.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: Create the dashboard composition and empty state

**Files:**
- Create: `components/quality/quality-dashboard.tsx`
- Create: `components/quality/quality-empty-state.tsx`

**Interfaces:**
- Consumes: `StatTile` (Task 3), `CoverageTrendChart` (Task 4), `CoverageByTypeChart` (Task 5), `TestRunList` (Task 6), `ProjectQualitySnapshot` from `@/lib/mock-data/quality`.
- Produces: `QualityDashboard({ snapshot: ProjectQualitySnapshot }): JSX.Element`, `QualityEmptyState(): JSX.Element`.

- [ ] **Step 1: Write `components/quality/quality-dashboard.tsx`**

```tsx
import { CoverageByTypeChart } from "@/components/quality/coverage-by-type-chart";
import { CoverageTrendChart } from "@/components/quality/coverage-trend-chart";
import { StatTile } from "@/components/quality/stat-tile";
import { TestRunList } from "@/components/quality/test-run-list";
import type { ProjectQualitySnapshot } from "@/lib/mock-data/quality";

export function QualityDashboard({ snapshot }: { snapshot: ProjectQualitySnapshot }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Overall coverage"
          value={`${snapshot.overallCoverage}%`}
          delta={`+${snapshot.coverageDelta}pts`}
        />
        <StatTile label="Build success rate" value={`${snapshot.buildSuccessRate}%`} />
        <StatTile label="Flaky test rate" value={`${snapshot.flakyTestRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CoverageTrendChart points={snapshot.coverageTrend} />
        <CoverageByTypeChart data={snapshot.coverageByType} />
      </div>

      <TestRunList runs={snapshot.latestRuns} />
    </div>
  );
}
```

- [ ] **Step 2: Write `components/quality/quality-empty-state.tsx`**

```tsx
import { BarChart3 } from "lucide-react";

export function QualityEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 text-center">
      <BarChart3 className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm font-medium">No quality data yet for this project</p>
      <p className="text-sm text-muted-foreground">
        Connect a CI integration to start seeing test runs and coverage here.
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/quality/quality-dashboard.tsx components/quality/quality-empty-state.tsx
git commit -m "$(cat <<'EOF'
Add QualityDashboard composition and empty state

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Create the trimmed project chat input and panel

**Files:**
- Create: `components/projects/project-chat-input.tsx`
- Create: `components/projects/project-chat-panel.tsx`

**Interfaces:**
- Consumes: `EmptyState` from `@/components/chat/empty-state`, `MessageList` from `@/components/chat/message-list`, `useOrdinoStore` from `@/lib/store` (`conversations`, `activeConversationId`, `sendMessage`).
- Produces: `ProjectChatInput({ onSend: (content: string) => void; disabled?: boolean }): JSX.Element`, `ProjectChatPanel({ projectId: string }): JSX.Element`.

- [ ] **Step 1: Write `components/projects/project-chat-input.tsx`**

This is the existing `components/chat/chat-input.tsx` pattern with the `AgentPicker` removed — the project page's spec calls for message list + input only, no agent picker.

```tsx
"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ProjectChatInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-border bg-card p-2 shadow-sm">
      <Textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
          }
        }}
        placeholder="Ask Ordino about this project…"
        rows={2}
        className="resize-none border-none bg-transparent shadow-none focus-visible:ring-0"
      />
      <div className="flex items-center justify-end px-1 pb-1">
        <Button
          type="submit"
          size="icon"
          disabled={!value.trim() || disabled}
          className="ordino-gradient-bg h-8 w-8 rounded-full text-white hover:opacity-90 disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Write `components/projects/project-chat-panel.tsx`**

This mirrors `app/(shell)/chat/page.tsx`'s `sendMessage`/thinking-delay pattern exactly, scoped to a `projectId` prop instead of the store's `activeProjectId`, and without `HistoryDrawer`.

```tsx
"use client";

import { useState } from "react";

import { EmptyState } from "@/components/chat/empty-state";
import { MessageList } from "@/components/chat/message-list";
import { ProjectChatInput } from "@/components/projects/project-chat-input";
import { useOrdinoStore } from "@/lib/store";

const THINKING_DELAY_MS = 900;

export function ProjectChatPanel({ projectId }: { projectId: string }) {
  const conversations = useOrdinoStore((state) => state.conversations);
  const activeConversationId = useOrdinoStore((state) => state.activeConversationId);
  const sendMessage = useOrdinoStore((state) => state.sendMessage);

  const [pendingUserContent, setPendingUserContent] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const conversation = conversations.find(
    (c) => c.id === activeConversationId && c.projectId === projectId,
  );
  const messages = conversation?.messages ?? [];

  function handleSend(content: string) {
    setPendingUserContent(content);
    setIsThinking(true);
    window.setTimeout(() => {
      sendMessage(projectId, content);
      setPendingUserContent(null);
      setIsThinking(false);
    }, THINKING_DELAY_MS);
  }

  const showEmptyState = messages.length === 0 && !pendingUserContent;

  return (
    <div className="flex h-full w-full flex-col border-l border-border">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Ordino</h2>
        <p className="text-xs text-muted-foreground">Scoped to this project</p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {showEmptyState ? (
          <EmptyState onSelectPrompt={handleSend} />
        ) : (
          <MessageList
            messages={messages}
            pendingUserContent={pendingUserContent}
            isThinking={isThinking}
          />
        )}
      </div>
      <div className="border-t border-border px-3 py-3">
        <ProjectChatInput onSend={handleSend} disabled={isThinking} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/projects/project-chat-input.tsx components/projects/project-chat-panel.tsx
git commit -m "$(cat <<'EOF'
Add project-scoped chat panel

Reuses the existing chat store, agent-router, and message components
(EmptyState/MessageList) exactly as /chat does, just scoped to a
projectId prop with no agent picker or history drawer.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Make the project card body navigate to the project page

**Files:**
- Modify: `components/projects/project-card.tsx`

**Interfaces:**
- Produces: clicking the card body (outside the "Open project" button) navigates to `/projects/${project.id}`; the "Open project" button's existing behavior (set active project, push `/chat`) is unchanged.

- [ ] **Step 1: Replace `handleOpen` and the outer/button markup**

In `components/projects/project-card.tsx`, replace:

```tsx
  function handleOpen() {
    setActiveProjectId(project.id);
    router.push("/chat");
  }

  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-card p-4">
```

with:

```tsx
  function handleOpenChat(event: React.MouseEvent) {
    event.stopPropagation();
    setActiveProjectId(project.id);
    router.push("/chat");
  }

  function handleOpenProjectPage() {
    router.push(`/projects/${project.id}`);
  }

  return (
    <div
      onClick={handleOpenProjectPage}
      onKeyDown={(event) => {
        if (event.key === "Enter") handleOpenProjectPage();
      }}
      role="link"
      tabIndex={0}
      className="flex cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
    >
```

Then replace the closing `Button`'s `onClick={handleOpen}` with `onClick={handleOpenChat}`:

```tsx
      <Button
        variant="ghost"
        size="sm"
        onClick={handleOpenChat}
        className="mt-3 justify-start px-0 text-sm text-muted-foreground hover:text-foreground"
      >
        Open project
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/projects/project-card.tsx
git commit -m "$(cat <<'EOF'
Make project card body open the new project page

Clicking the card (outside the "Open project" button) now navigates
to /projects/[projectId]. "Open project" keeps routing to /chat
unchanged — the button's click handler stops propagation so the two
destinations don't fight.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: Create the project page route

**Files:**
- Create: `app/(shell)/projects/[projectId]/page.tsx`

**Interfaces:**
- Consumes: `useOrdinoStore` (`projects`, `conversations`, `setActiveProjectId`, `setActiveConversationId`), `getQualitySnapshot` (Task 2), `QualityDashboard` (Task 7), `QualityEmptyState` (Task 7), `ProjectChatPanel` (Task 8).
- Produces: the `/projects/[projectId]` route.

- [ ] **Step 1: Write the file**

```tsx
"use client";

import { use, useEffect } from "react";

import { ProjectChatPanel } from "@/components/projects/project-chat-panel";
import { QualityDashboard } from "@/components/quality/quality-dashboard";
import { QualityEmptyState } from "@/components/quality/quality-empty-state";
import { getQualitySnapshot } from "@/lib/mock-data/quality";
import { useOrdinoStore } from "@/lib/store";

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  const projects = useOrdinoStore((state) => state.projects);
  const conversations = useOrdinoStore((state) => state.conversations);
  const setActiveProjectId = useOrdinoStore((state) => state.setActiveProjectId);
  const setActiveConversationId = useOrdinoStore((state) => state.setActiveConversationId);

  const project = projects.find((p) => p.id === projectId);
  const snapshot = getQualitySnapshot(projectId);

  useEffect(() => {
    setActiveProjectId(projectId);
    const latest = [...conversations]
      .filter((c) => c.projectId === projectId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    if (latest) {
      setActiveConversationId(latest.id);
    }
    // Runs once per projectId only: setActiveProjectId resets
    // activeConversationId to null, so including `conversations` here
    // would re-fire on every sent message and fight the chat panel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-8 text-sm text-muted-foreground">
        Project not found.
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0">
      <div className="min-w-0 flex-1 overflow-y-auto px-6 py-8">
        <h1 className="text-xl font-semibold">{project.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{project.description}</p>

        <div className="mt-6">
          {snapshot ? <QualityDashboard snapshot={snapshot} /> : <QualityEmptyState />}
        </div>
      </div>

      <div className="w-[400px] shrink-0">
        <ProjectChatPanel projectId={projectId} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit`
Expected: no output.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(shell)/projects/[projectId]/page.tsx"
git commit -m "$(cat <<'EOF'
Add /projects/[projectId] page

Dashboard-main, chat-side-panel layout inside the existing shell
chrome. Unwraps the Promise-based params via React's use() since the
page needs client interactivity.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: End-to-end browser verification

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server (check for one first)**

Check whether a dev server is already running on port 3000 before starting a new one — killing someone else's already-running server is a real risk here, not a hypothetical:

```bash
curl -sf http://localhost:3000 >/dev/null && echo "already running — reuse it, do not start a second one" || echo "not running — start it"
```

If nothing is running, start it in the background, capture its exact PID, and poll until it responds:

```bash
nohup npm run dev > /tmp/project-page-dev.log 2>&1 &
echo $! > /tmp/project-page-dev.pid
for i in $(seq 1 30); do curl -sf http://localhost:3000 >/dev/null && echo "server up" && break; sleep 1; done
```

`/tmp/project-page-dev.pid` now holds the exact PID you started — Step 5 kills only that PID, never a blanket `pkill -f "next dev"` (which would also kill a server someone else already had running).

- [ ] **Step 2: Find the cached Playwright install**

This repo has no `playwright` npm dependency, but a cached copy exists from `npx playwright`'s own install cache. Find it:

```bash
find "$(npm config get cache)/_npx" -maxdepth 3 -iname "playwright" -type d
```

This prints one or more paths like `/Users/<you>/.npm/_npx/<hash>/node_modules/playwright`. If none are found, run `npx --yes playwright --version` once first (installs it into that cache), then re-run the `find` command above. Use the path it prints as `PLAYWRIGHT_PKG_PATH` below.

- [ ] **Step 3: Write and run the driver script**

Write this to `/tmp/drive-project-page.js`, replacing `PLAYWRIGHT_PKG_PATH` on line 1 with the exact path from Step 2:

```js
const { chromium } = require("PLAYWRIGHT_PKG_PATH");

const SHOT_DIR = "/tmp/project-page-shots";

async function main() {
  const fs = require("fs");
  fs.mkdirSync(SHOT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const errors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push("pageerror: " + err.message));

  console.log("1) /projects");
  await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Booking Website");
  await page.screenshot({ path: `${SHOT_DIR}/01-projects.png` });

  console.log("2) Open project button still goes to /chat");
  await page.click("text=Open project >> nth=0");
  await page.waitForSelector("text=Booking Website", { timeout: 10000 });
  if (!page.url().endsWith("/chat")) throw new Error(`Expected /chat, got ${page.url()}`);
  await page.screenshot({ path: `${SHOT_DIR}/02-chat-unchanged.png` });

  console.log("3) Card body navigates to /projects/proj-booking-website");
  await page.goto("http://localhost:3000/projects", { waitUntil: "networkidle" });
  await page.click("text=Booking Website");
  await page.waitForSelector("text=Coverage trend", { timeout: 10000 });
  if (page.url() !== "http://localhost:3000/projects/proj-booking-website") {
    throw new Error(`Expected /projects/proj-booking-website, got ${page.url()}`);
  }

  console.log("4) Dashboard numbers");
  const bodyText = await page.textContent("body");
  for (const expected of ["71%", "Coverage trend", "Coverage by type", "src/lib/pricing.test.ts"]) {
    if (!bodyText.includes(expected)) throw new Error(`Missing "${expected}" on dashboard`);
  }
  await page.screenshot({ path: `${SHOT_DIR}/03-dashboard.png` });

  console.log("5) Chat panel opens the existing seeded conversation");
  await page.waitForSelector("text=Pulled coverage data from the latest GitHub Actions run", {
    timeout: 5000,
  });

  console.log("6) Ask a code-quality question, confirm routing");
  await page.fill("textarea[placeholder='Ask Ordino about this project…']", "what's our code quality like");
  await page.press("textarea[placeholder='Ask Ordino about this project…']", "Enter");
  await page.waitForSelector("text=Code Quality", { timeout: 5000 });
  await page.screenshot({ path: `${SHOT_DIR}/04-chat-routed.png` });

  console.log("7) Internal Admin Console empty state");
  await page.goto("http://localhost:3000/projects/proj-internal-admin", { waitUntil: "networkidle" });
  await page.waitForSelector("text=No quality data yet for this project", { timeout: 10000 });
  await page.screenshot({ path: `${SHOT_DIR}/05-empty-state.png` });

  console.log("8) Theme toggle doesn't break either page");
  await page.click("button[aria-label='Toggle theme']");
  await page.waitForTimeout(200);
  await page.goto("http://localhost:3000/projects/proj-booking-website", { waitUntil: "networkidle" });
  await page.waitForSelector("text=Coverage trend", { timeout: 10000 });
  await page.screenshot({ path: `${SHOT_DIR}/06-after-theme-toggle.png` });

  console.log("Console errors:", JSON.stringify(errors, null, 2));
  if (errors.length > 0) throw new Error("Console errors were logged — see above");

  await browser.close();
  console.log("ALL CHECKS PASSED");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

Run it:

```bash
node /tmp/drive-project-page.js
```

Expected: it prints steps 1–8, ends with `ALL CHECKS PASSED`, and does not throw. Read each screenshot in `/tmp/project-page-shots/` to confirm visually — a script passing its own assertions is not sufficient on its own; look at the images.

- [ ] **Step 4: Fix anything the run surfaces**

If any assertion fails or a screenshot looks wrong, fix the relevant component/page file and re-run Step 3 (don't skip re-verification after a fix).

- [ ] **Step 5: Stop the dev server — only if you started it**

If Step 1 found a server already running, leave it running — it isn't yours to stop. Only if you started it yourself in Step 1 (you have `/tmp/project-page-dev.pid`):

```bash
if [ -f /tmp/project-page-dev.pid ]; then
  kill "$(cat /tmp/project-page-dev.pid)"
  rm /tmp/project-page-dev.pid
fi
```
