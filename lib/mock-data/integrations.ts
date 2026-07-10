import type { Integration } from "@/lib/types";

export const integrationCatalog: Integration[] = [
  {
    id: "int-jira",
    type: "jira",
    name: "Jira",
    description: "Sync issues, sprints, and project tracking.",
    status: "not-connected",
  },
  {
    id: "int-confluence",
    type: "confluence",
    name: "Confluence",
    description: "Pull in specs, RFCs, and documentation.",
    status: "not-connected",
  },
  {
    id: "int-notion",
    type: "notion",
    name: "Notion",
    description: "Reference docs, wikis, and planning pages.",
    status: "not-connected",
  },
  {
    id: "int-linear",
    type: "linear",
    name: "Linear",
    description: "Sync issues, projects, and cycles.",
    status: "not-connected",
  },
  {
    id: "int-github",
    type: "github",
    name: "GitHub",
    description: "Code, PRs, CI runs, and coverage reports.",
    status: "connected",
    accountLabel: "ordino-labs/booking-website",
    connectedAt: "2026-06-18",
  },
  {
    id: "int-bitbucket",
    type: "bitbucket",
    name: "Bitbucket",
    description: "Code, PRs, and pipelines.",
    status: "not-connected",
  },
  {
    id: "int-slack",
    type: "slack",
    name: "Slack",
    description: "Notifications and conversational handoff.",
    status: "not-connected",
  },
  {
    id: "int-google-drive",
    type: "google-drive",
    name: "Google Drive",
    description: "Docs, sheets, and shared files.",
    status: "not-connected",
  },
  {
    id: "int-database",
    type: "database",
    name: "Database",
    description: "Connect a Postgres/MySQL instance for schema-aware answers.",
    status: "not-connected",
  },
];
