"use client";

import { useState } from "react";

import { ChatInput } from "@/components/chat/chat-input";
import { EmptyState } from "@/components/chat/empty-state";
import { HistoryDrawer } from "@/components/chat/history-drawer";
import { MessageList } from "@/components/chat/message-list";
import { useOrdinoStore } from "@/lib/store";

const THINKING_DELAY_MS = 900;

export default function ChatPage() {
  const activeProjectId = useOrdinoStore((state) => state.activeProjectId);
  const activeConversationId = useOrdinoStore((state) => state.activeConversationId);
  const conversations = useOrdinoStore((state) => state.conversations);
  const sendMessage = useOrdinoStore((state) => state.sendMessage);

  const [pendingUserContent, setPendingUserContent] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);

  const conversation = conversations.find(
    (c) => c.id === activeConversationId && c.projectId === activeProjectId,
  );
  const messages = conversation?.messages ?? [];

  function handleSend(content: string) {
    setPendingUserContent(content);
    setIsThinking(true);
    window.setTimeout(() => {
      sendMessage(activeProjectId, content);
      setPendingUserContent(null);
      setIsThinking(false);
    }, THINKING_DELAY_MS);
  }

  const showEmptyState = messages.length === 0 && !pendingUserContent;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="truncate text-sm font-medium text-muted-foreground">
          {conversation?.title || "New conversation"}
        </span>
        <HistoryDrawer />
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

      <div className="border-t border-border px-4 py-3">
        <ChatInput onSend={handleSend} disabled={isThinking} />
      </div>
    </div>
  );
}
