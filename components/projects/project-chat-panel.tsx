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
