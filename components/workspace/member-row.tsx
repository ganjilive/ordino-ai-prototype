import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { TeamMember } from "@/lib/types";

export function MemberRow({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs text-white" style={{ backgroundColor: member.avatarColor }}>
            {member.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">{member.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs capitalize">
          {member.role}
        </Badge>
        {member.status === "pending" && (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        )}
      </div>
    </div>
  );
}
