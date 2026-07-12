# Ordino Features

A technical, capability-level companion to [`user-stories.md`](./user-stories.md) — grouped by subsystem rather than persona, so it's usable as input to architecture design rather than product narrative. Each feature notes what it needs from the [target architecture](./user-stories.md#target-architecture) and what it depends on from other features, since that dependency shape is what should drive sequencing and service boundaries.

Everything below exists today only as a scripted, mocked-up prototype — a UX proof, not working software. Each entry describes the intended capability and what it would actually take to build.

---

## Access & integration management
Grants and revokes Ordino's access to external systems, scoped per-system (e.g. specific repos, not "all of GitHub"). Everything else in this list depends on this — no feature can reach a system Ordino hasn't been granted.
- Repo picker / scoped GitHub grant (connect, disconnect, see current scope)
- Generic integration catalog (Jira, Confluence, Notion, Linear, Slack, Bitbucket, Google Drive, Database) — the prototype mocks connect/disconnect for all of these, but only GitHub is actually consumed downstream today.

## PR verification engine
Evaluates a PR against the user flows it could affect and produces a single verdict. This is the core "trust" primitive — most other features either feed it (test generation, security scanning) or consume its output (merge gate, agent trust).
- Flow-check evaluation → pass/fail per user flow, with a "finding" on failure
- Verdict computation (safe-to-merge vs. regression-found), accounting for human overturns
- Fix-prompt generation for a caught regression
- "Pre-verified" status (verification completed before the PR was opened)
- **Needs**: repo access, a way to define/discover "user flows" for a given codebase (this is the hardest unsolved modeling problem in the whole feature set — the prototype just hardcodes them), a way to actually execute/observe those flows.

## Test generation & coverage analysis
Given a diff, finds what's untested about it specifically (not overall repo coverage) and generates tests to close the gap across layers.
- Coverage-gap detection scoped to changed code
- Multi-layer test generation (unit / component / e2e)
- Local test execution + pass/fail reporting
- Review-before-commit handoff with a generated commit message
- **Needs**: repo access, a test runner integration for the target stack, an LLM capable of writing tests against the actual project's conventions.

## Cross-repo dependency graph & impact analysis
Maps a change in one repo to the other repos that depend on it, and extends test generation across that boundary.
- Dependency graph construction across granted repos
- Proactive (unprompted) impact warning
- Cross-repo test generation (reuses the test generation engine, targeting a different repo)
- **Needs**: access to *multiple* repos at once, the dependency graph itself (static analysis / import graph), test generation engine.

## Agent trust ledger
Tallies each coding agent's historical outcomes (verified, caught regressions, overturned) into a track record.
- Per-agent and per-project track record computation
- **Needs**: PR verification engine's output as its only input — this is a pure aggregation feature, no new external access required. Cheapest feature in the list to actually build, since it's downstream of PR verification rather than needing new integrations.

## Merge policy / gate engine
Whether a PR can merge without human review, based on its verdict.
- Per-project policy toggle (the prototype only mocks this as advisory copy — no real enforcement)
- Actual merge blocking via the Git host's API
- Override path with an audit trail
- **Needs**: PR verification engine, and (for enforcement) write/protection access to the Git host, not just read access.

## Quality analytics dashboard
Presentation layer over historical coverage/build/flaky-rate data. Descriptive, not prescriptive — doesn't act on anything itself.
- Coverage %, build success rate, flaky-test rate, trended over time
- Per-test-type breakdown
- Recent test-run history
- **Needs**: a real data pipeline of historical CI runs — the prototype's numbers are static mock data, not computed from anything.

## Conversational routing
Routes a chat message to the right internal specialist automatically; no manual override (removed deliberately — see `user-stories.md` §8).
- Keyword/intent-based routing
- Per-project conversation history
- **Needs**: nothing external — purely an internal routing layer over whichever other features can answer the question.

## Team & workspace management
- Invite teammates with a role (owner/admin/member)
- **Needs**: nothing from the target architecture diagram — this is Ordino's own user management, nothing on the SDLC side.

## Post-deploy regression watch
Watches production signal after a release and flags a regression back to the PR that likely caused it.
- **Needs**: an observability-tools integration, PR verification engine (to attribute back to a PR), a deploy-to-PR mapping.

## Incident-to-commit triage
- **Needs**: an observability-tools integration, cross-repo dependency graph, a ranking/confidence model over "which recent change is likely responsible."

## Flaky test quarantine
- **Needs**: historical per-test run data (flaky vs. failing requires seeing a test run more than once) — has a cold-start problem: needs the quality analytics data pipeline running for a while before it has anything to detect.

## Security & dependency scanning in the verdict
- **Needs**: a CVE/secret-scanning engine (build or integrate one — e.g. wrapping an existing SCA tool), folded into the same verdict/flow-check UI the PR verification engine already has.

## Policy learning from overturns
- **Needs**: PR verification engine's overturn history as input; a model for generalizing "this specific overturn" into "this pattern of finding." The riskiest feature to get right — false generalization means Ordino silently stops catching a real regression class.

## Release notes & org-level reporting
- **Needs**: PR verification engine (what was verified), agent trust ledger (rollup), aggregated across projects.

## Work & requirement context (Jira, Linear)
- **Needs**: the Jira/Linear connection from the integration catalog actually wired into the PR verification engine (ticket → acceptance criteria → flow checks), rather than just sitting connectable and unused as it does today.

## Communication & notifications (Slack)
- **Needs**: the Slack connection from the integration catalog wired as an output channel from the PR verification engine / dependency graph, rather than just sitting connectable and unused as it does today.

## Direct agent invocation
Today's coding-agent ↔ Ordino handoff is human-mediated (copy a fix prompt, paste it into the agent). The target architecture has the agent calling Ordino directly.
- **Needs**: a callable API/interface for Ordino (not just a chat UI) that a coding agent can invoke programmatically — this is an architecture decision in its own right (webhook? MCP tool? CLI?) and is probably the single highest-leverage thing to nail early, since §"Pre-verified" PRs and the whole "invoke" edge in the target architecture depend on it existing.

---

## Recommended first thin slice: Test generation & coverage gap-filling, single repo

**Scope for v1**: given a diff in one connected repo, detect what's untested about *that diff specifically*, generate the missing tests across unit/component/e2e layers, run them locally, and hand back a reviewable, commit-ready result. This is `§Test generation & coverage analysis` above, deliberately cut off from everything it *could* connect to.

**Why this one, not another testing-scoped candidate:**

| Candidate | Why not first |
|---|---|
| **PR verification engine** (flow-check verdicts) | Highest-value long-term, but blocked on the hardest unsolved problem in the whole list: *how does Ordino know what a "user flow" is* for an arbitrary codebase? The prototype hardcodes this. Building it for real means solving flow discovery before you can ship anything. |
| **Quality analytics dashboard** | Purely descriptive — no new intelligence, just a data pipeline and charts. Low risk, but also low differentiation as a *first* release; doesn't prove Ordino can do anything a coverage tool doesn't already do. |
| **Flaky test quarantine** | Cold-start problem — needs historical run data that doesn't exist until something else has been running in production for a while. Can't be first. |
| **Cross-repo dependency graph** | Real differentiator, but multiplies scope: needs multi-repo access *and* a dependency graph *and* the test-generation engine working correctly first. Natural v2 once single-repo test generation is solid. |

**Why this slice specifically works as "thin":**
- **Smallest new integration surface.** Needs exactly two things from the target architecture: read/write access to one repo's Local Code, and a way to invoke that repo's existing test runner. No observability, no Jira/Slack, no merge-gate enforcement, no multi-repo graph.
- **Self-contained value, no dependencies on other features from this list.** Doesn't need the PR verification engine, agent trust ledger, or merge policy to exist first — it stands alone.
- **Forces the two hardest general-purpose engineering problems early, in their simplest form.** "Generate a test that matches this codebase's conventions and actually passes" and "run it and report results back" are exactly what §PR verification, §cross-repo impact analysis, and §flaky quarantine will all need later — solving it once here de-risks three future features.
- **Produces a legible, demoable artifact.** "Here's the coverage gap, here are the tests, here's them passing" is easy for a developer to evaluate and trust — which matters more for a first release than for later ones, since this is what earns the right to be trusted with less oversight.

**Explicitly out of scope for v1**: multi-repo awareness, merge blocking, flow-check verdicts, and all four external integrations (Jira, Slack, observability, direct agent invocation) — those are v2+ once this slice is proven.

**Update**: the actual decided iteration-one scope also includes the Quality analytics dashboard, overriding the "defer the dashboard" reasoning above — see [`iteration-one.md`](./iteration-one.md) for the current scope and why.
