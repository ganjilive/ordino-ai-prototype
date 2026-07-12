"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { routeMessage } from "@/lib/agent-router";
import { seedConversations } from "@/lib/mock-data/conversations";
import { integrationCatalog } from "@/lib/mock-data/integrations";
import { seedProjects } from "@/lib/mock-data/projects";
import { seedTeamMembers } from "@/lib/mock-data/team";
import type {
  ChatMessage,
  Conversation,
  Integration,
  MemberRole,
  Project,
  TeamMember,
} from "@/lib/types";

function makeId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

interface OrdinoState {
  theme: "light" | "dark";
  toggleTheme: () => void;

  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  createProject: (name: string, description: string) => string;

  integrations: Integration[];
  connectIntegration: (id: string, accountLabel: string) => void;
  disconnectIntegration: (id: string) => void;

  teamMembers: TeamMember[];
  inviteMember: (name: string, email: string, role: MemberRole) => void;

  conversations: Conversation[];
  activeConversationId: string | null;
  pinnedAgentId: string | "auto";
  setPinnedAgentId: (id: string | "auto") => void;
  startConversation: (projectId: string) => string;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (projectId: string, content: string) => void;

  dismissedFlowIds: string[];
  toggleFlowDismissed: (flowId: string) => void;

  requireVerificationPolicy: Record<string, boolean>;
  setRequireVerificationPolicy: (projectId: string, required: boolean) => void;
}

export const useOrdinoStore = create<OrdinoState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),

      projects: seedProjects,
      activeProjectId: seedProjects[0].id,
      setActiveProjectId: (id) =>
        set({ activeProjectId: id, activeConversationId: null }),
      createProject: (name, description) => {
        const id = makeId("proj");
        const project: Project = {
          id,
          name,
          description,
          createdAt: new Date().toISOString().slice(0, 10),
          integrationIds: [],
        };
        set((state) => ({
          projects: [...state.projects, project],
          activeProjectId: id,
          activeConversationId: null,
        }));
        return id;
      },

      integrations: integrationCatalog,
      connectIntegration: (id, accountLabel) =>
        set((state) => ({
          integrations: state.integrations.map((integration) =>
            integration.id === id
              ? {
                  ...integration,
                  status: "connected",
                  accountLabel,
                  connectedAt: new Date().toISOString().slice(0, 10),
                }
              : integration,
          ),
        })),
      disconnectIntegration: (id) =>
        set((state) => ({
          integrations: state.integrations.map((integration) =>
            integration.id === id
              ? {
                  ...integration,
                  status: "not-connected",
                  accountLabel: undefined,
                  connectedAt: undefined,
                }
              : integration,
          ),
        })),

      teamMembers: seedTeamMembers,
      inviteMember: (name, email, role) =>
        set((state) => ({
          teamMembers: [
            ...state.teamMembers,
            {
              id: makeId("member"),
              name,
              email,
              role,
              status: "pending",
              avatarColor: "var(--ordino-purple)",
            },
          ],
        })),

      conversations: seedConversations,
      activeConversationId: seedConversations[0]?.id ?? null,
      pinnedAgentId: "auto",
      setPinnedAgentId: (id) => set({ pinnedAgentId: id }),
      startConversation: (projectId) => {
        const id = makeId("conv");
        const conversation: Conversation = {
          id,
          projectId,
          title: "New conversation",
          createdAt: new Date().toISOString(),
          messages: [],
        };
        set((state) => ({
          conversations: [...state.conversations, conversation],
          activeConversationId: id,
        }));
        return id;
      },
      setActiveConversationId: (id) => set({ activeConversationId: id }),
      sendMessage: (projectId, content) => {
        const state = get();
        let conversationId = state.activeConversationId;
        let conversations = state.conversations;

        const activeConversation = conversations.find(
          (c) => c.id === conversationId && c.projectId === projectId,
        );

        if (!activeConversation) {
          conversationId = makeId("conv");
          const newConversation: Conversation = {
            id: conversationId,
            projectId,
            title: content.slice(0, 48),
            createdAt: new Date().toISOString(),
            messages: [],
          };
          conversations = [...conversations, newConversation];
        }

        const userMessage: ChatMessage = {
          id: makeId("msg"),
          role: "user",
          content,
          createdAt: new Date().toISOString(),
        };

        const previousAgentId = [...(activeConversation?.messages ?? [])]
          .reverse()
          .find((m) => m.role === "assistant")?.agentId;

        const routing = routeMessage(content, state.pinnedAgentId, previousAgentId);

        const newMessages: ChatMessage[] = [userMessage];
        if (routing.switched) {
          newMessages.push({
            id: makeId("msg"),
            role: "system",
            content: `Switched agent for this task`,
            agentId: routing.agentId,
            createdAt: new Date().toISOString(),
          });
        }
        newMessages.push({
          id: makeId("msg"),
          role: "assistant",
          content: routing.content,
          agentId: routing.agentId,
          createdAt: new Date().toISOString(),
        });

        set({
          activeConversationId: conversationId,
          conversations: conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  title:
                    c.messages.length === 0 ? content.slice(0, 48) : c.title,
                  messages: [...c.messages, ...newMessages],
                }
              : c,
          ),
        });
      },

      dismissedFlowIds: [],
      toggleFlowDismissed: (flowId) =>
        set((state) => ({
          dismissedFlowIds: state.dismissedFlowIds.includes(flowId)
            ? state.dismissedFlowIds.filter((id) => id !== flowId)
            : [...state.dismissedFlowIds, flowId],
        })),

      requireVerificationPolicy: {},
      setRequireVerificationPolicy: (projectId, required) =>
        set((state) => ({
          requireVerificationPolicy: { ...state.requireVerificationPolicy, [projectId]: required },
        })),
    }),
    {
      name: "ordino-prototype-store",
    },
  ),
);
