"use client";

import { MemberRow } from "@/components/workspace/member-row";
import { InviteMemberDialog } from "@/components/workspace/invite-member-dialog";
import { useOrdinoStore } from "@/lib/store";

export default function WorkspacePage() {
  const teamMembers = useOrdinoStore((state) => state.teamMembers);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Invite teammates to collaborate with you across projects.
          </p>
        </div>
        <InviteMemberDialog />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {teamMembers.map((member) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
