export type IntegrationType =
  | "jira"
  | "confluence"
  | "notion"
  | "linear"
  | "github"
  | "bitbucket"
  | "slack"
  | "google-drive"
  | "database";

export type IntegrationStatus = "connected" | "not-connected";

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  status: IntegrationStatus;
  accountLabel?: string;
  connectedAt?: string;
  repos?: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  integrationIds: string[];
}

export type MemberRole = "owner" | "admin" | "member";
export type MemberStatus = "active" | "pending";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  avatarColor: string;
}

export type AgentTier = "local" | "cloud";

export interface Agent {
  id: string;
  name: string;
  tier: AgentTier;
  description: string;
  keywords: string[];
  color: string;
}

export type MessageRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  agentId?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}
