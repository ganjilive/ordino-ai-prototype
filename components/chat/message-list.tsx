"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/chat/message-bubble";
import type { ChatMessage } from "@/lib/types";

export function MessageList({
  messages,
  pendingUserContent,
  isThinking,
}: {
  messages: ChatMessage[];
  pendingUserContent: string | null;
  isThinking: boolean;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isThinking]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-6 py-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {pendingUserContent && (
        <MessageBubble
          message={{
            id: "pending",
            role: "user",
            content: pendingUserContent,
            createdAt: new Date().toISOString(),
          }}
        />
      )}
      {isThinking && (
        <div className="flex items-center gap-1.5 px-1 text-sm text-muted-foreground">
          <span className="flex gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </span>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
