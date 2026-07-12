# Ordino — Iteration One

The first release scope, built on the "Recommended first thin slice" in [`features.md`](./features.md#recommended-first-thin-slice-test-generation--coverage-gap-filling-single-repo) plus one deliberate addition beyond that base recommendation: **test generation & coverage gap-filling, plus the quality analytics dashboard, scoped to a single connected repo.**

Given a diff in one repo, detect what's untested about that diff specifically, generate the missing tests across unit/component/e2e layers, run them locally, and hand back a reviewable, commit-ready result — and surface that (and every run like it) in a centralized dashboard, so quality is something a user can *see*, not just something that happens inline in a chat reply. The dashboard was originally deferred in `features.md`'s base recommendation (reasoning: purely descriptive, low differentiation as a *sole* first release); it's included here because centralized visibility into product quality is decided to be worth it for iteration one specifically.

This doc cross-references every epic in `user-stories.md` and every feature in `features.md` against that scope, so it's explicit — not implied — what iteration one includes, what it needs at reduced scope, and what it deliberately leaves out.

---

## Epic-by-epic cross-check

| # | Epic (`user-stories.md`) | Status | Why |
|---|---|---|---|
| 1 | Granting & scoping repo access | **Included — reduced** | Only single-repo GitHub connect / disconnect / "what's connected" visibility. No multi-repo picker, no other integrations from the catalog. |
| 2 | Pre-merge PR verification | Excluded | Depends on discovering "user flows" for an arbitrary codebase — the hardest unsolved problem in `features.md`. Not attempted in iteration one. |
| 3 | Agent trust & track record | Excluded | Per `features.md`, this is a pure aggregation over the PR verification engine's output. No PR verification engine, no trust ledger. |
| 4 | Merge policy | Excluded | Iteration one doesn't touch merging at all. |
| 5 | Quality visibility | **Included — in full** | Deliberately added beyond the base recommendation, for centralized quality visibility. Coverage and per-run data can be sourced from §6's own output once persisted; build success rate is the one metric that needs a genuinely new dependency (CI/CD artifact access — see note below). |
| 6 | Test generation & coverage gap-filling | **Included — in full** | This epic *is* the slice. All four stories apply. |
| 7 | Cross-repo dependency awareness | Excluded | Multi-repo is explicitly out of scope; this is the natural next slice once §6 is solid. |
| 8 | Conversational assistant | Excluded — minimal trigger only | The full auto-routing-to-specialists engine isn't needed to trigger one flow. Iteration one needs *some* way for a developer to invoke it — see "Open question" below. |
| 9 | Team & workspace | Excluded | Not relevant to a single-developer flow. |
| 10 | Post-deploy regression watch | Excluded | Needs an observability integration — not in scope. |
| 11 | Incident-to-commit triage | Excluded | Needs observability + the cross-repo graph — neither in scope. |
| 12 | Flaky test quarantine | Excluded | Cold-start problem: needs historical run data that doesn't exist yet. |
| 13 | Security & dependency scanning in the verdict | Excluded | Extends the PR verdict, which isn't in scope. |
| 14 | Policy learning from overturns | Excluded | Depends on the PR verification engine's overturn history. |
| 15 | Release notes & org-level reporting | Excluded | Depends on the PR verification engine and agent trust ledger. |
| 16 | Work & requirement context (Jira, Linear) | Excluded | External integration, explicitly deferred. |
| 17 | Communication & notifications (Slack) | Excluded | External integration, explicitly deferred. |
| 18 | Direct agent invocation | Excluded | Explicitly deferred — iteration one's trigger is human-initiated, not agent-initiated. |

---

## User stories fulfilled

### §1. Granting & scoping repo access *(reduced to one repo)*
- As a **lead**, I want to grant Ordino access to a specific repo — not an all-or-nothing connection — so that I control exactly what Ordino can see and act on.
- As a **lead**, I want to disconnect that repo and have access revoked immediately, so that I can pull back access without ceremony.
- As a **developer**, I want to see whether Ordino currently has access to my repo at a glance, so that its behavior is backed by visible, real scope rather than assumed.

*(These are §1's three stories from `user-stories.md`, narrowed from "specific repos" to "a specific repo" — the multi-repo scoped picker built in the prototype is more than iteration one needs.)*

### §6. Test generation & coverage gap-filling *(in full)*
- As a **developer**, I want Ordino to check test coverage for the code I just changed — not just run the existing suite — so that I find gaps before a reviewer or a bug report does.
- As a **developer**, I want Ordino to call out which specific untested path matters most, so that the coverage report is actionable, not just a percentage.
- As a **developer**, I want Ordino to generate the missing tests across the right layers — unit, component, and end-to-end — and run them locally, so that closing a coverage gap doesn't mean writing three kinds of tests by hand.
- As a **developer**, I want the generated tests presented for my review with a ready commit message before anything is committed, so that I stay in control of what ships.

### §5. Quality visibility *(in full — added beyond the base recommendation)*
- As a **lead**, I want to see overall test coverage, build success rate, and flaky test rate for a project at a glance, so that I can spot a quality trend before it becomes a problem.
- As a **lead**, I want coverage broken down by test type (unit / integration / front-end) and trended over time, so that I know where the gaps actually are.
- As a **developer**, I want to see recent test suite runs with pass/fail counts and flaky-test notes, so that I can tell a real failure from noise.

---

## Features included

| Feature (`features.md`) | Scope in iteration one |
|---|---|
| **Access & integration management** | Single-repo GitHub connect/disconnect + visibility only. The generic multi-integration catalog (Jira, Confluence, Notion, Linear, Slack, Bitbucket, Google Drive, Database) is not touched. |
| **Test generation & coverage analysis** | In full — coverage-gap detection scoped to the diff, multi-layer test generation, local execution, review-before-commit handoff. |
| **Quality analytics dashboard** | In full, added beyond the base recommendation — coverage %, per-test-type breakdown, and recent-run history, trended over time. Flaky-test rate will read as sparse/empty until enough runs accumulate — that's expected, not a bug, since detecting flakiness needs repeated runs of the same test (see §12, still excluded). |

Everything else in `features.md` is out of scope for iteration one (see the cross-check table above for the epic-level reasons; the feature-level dependency notes in `features.md` are what this table is built from).

### New architecture implication from including the dashboard

Pure test generation (the base recommendation) is stateless — one diff in, one result out, nothing needs to be remembered. Adding the dashboard changes that:

- **Persistence is now required.** The dashboard's "trended over time" and "recent runs" stories mean every test-generation run's output (coverage %, pass/fail, per-layer breakdown) needs to be stored, not just displayed once and discarded. This wasn't a requirement of the base slice at all.
- **Build success rate needs a new dependency.** Coverage and per-run data can be derived entirely from what the test-generation engine already produces. Build success rate can't — it means the CI build's pass/fail status, which requires read access to CI/CD artifacts (the target-architecture diagram's `CI/CD Artefacts` node), not just the local test runner this slice otherwise needs. Worth deciding early whether that's a real CI integration or deferred/stubbed for iteration one.

## Open question for architecture: how does a developer trigger this?

`features.md` explicitly defers both the full conversational routing engine (§8) and direct agent invocation (§18) — so iteration one needs *some* minimal, human-initiated trigger that isn't either of those. Candidates, deliberately left for your team to decide rather than assumed here:

- A single dedicated command in a chat-like surface, without the multi-specialist auto-routing behind it.
- An IDE/editor command or extension action.
- A CLI command, run manually or wired into a pre-commit/pre-push hook.

Whichever is chosen shapes the rest of the architecture (what has to be a service vs. what can be a local process), so it's worth deciding deliberately rather than defaulting to whatever the prototype's chat panel happens to look like.
