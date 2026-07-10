"use client";

import { History, MessageSquarePlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrdinoStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function HistoryDrawer() {
  const [open, setOpen] = useState(false);
  const activeProjectId = useOrdinoStore((state) => state.activeProjectId);
  const conversations = useOrdinoStore((state) => state.conversations);
  const activeConversationId = useOrdinoStore((state) => state.activeConversationId);
  const setActiveConversationId = useOrdinoStore((state) => state.setActiveConversationId);
  const startConversation = useOrdinoStore((state) => state.startConversation);

  const projectConversations = conversations
    .filter((c) => c.projectId === activeProjectId)
    .slice()
    .reverse();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="sm" className="text-muted-foreground" />}>
        <History className="h-4 w-4" />
        History
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Conversations</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-1 px-4">
          <Button
            variant="outline"
            size="sm"
            className="mb-2 justify-start"
            onClick={() => {
              startConversation(activeProjectId);
              setOpen(false);
            }}
          >
            <MessageSquarePlus className="h-4 w-4" />
            New chat
          </Button>
          {projectConversations.length === 0 && (
            <p className="px-1 text-sm text-muted-foreground">No conversations yet.</p>
          )}
          {projectConversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => {
                setActiveConversationId(conversation.id);
                setOpen(false);
              }}
              className={cn(
                "truncate rounded-md px-2 py-2 text-left text-sm hover:bg-accent",
                conversation.id === activeConversationId &&
                  "bg-accent font-medium",
              )}
            >
              {conversation.title || "New conversation"}
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
