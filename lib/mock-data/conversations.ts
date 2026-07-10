import type { Conversation } from "@/lib/types";

export const seedConversations: Conversation[] = [
  {
    id: "conv-welcome",
    projectId: "proj-booking-website",
    title: "Test coverage check-in",
    createdAt: "2026-07-08T14:20:00Z",
    messages: [
      {
        id: "msg-1",
        role: "user",
        content: "What's our current test coverage looking like?",
        createdAt: "2026-07-08T14:20:00Z",
      },
      {
        id: "msg-2",
        role: "system",
        content: "Routed to QE Specialist (Local)",
        agentId: "qe-specialist",
        createdAt: "2026-07-08T14:20:02Z",
      },
      {
        id: "msg-3",
        role: "assistant",
        agentId: "qe-specialist",
        content:
          "Pulled coverage data from the latest GitHub Actions run on main.\n\nOverall line coverage: 71% (up from 66% last month)\n\nBy area:\n- src/checkout: 84%\n- src/booking-flow: 58% — lowest in the repo, and it's the area with the most bug reports last sprint\n- src/auth: 92%\n- src/shared/components: 65%\n\nbooking-flow is the clear gap. Want me to draft a coverage-improvement plan for that module specifically?",
        createdAt: "2026-07-08T14:20:04Z",
      },
    ],
  },
];
