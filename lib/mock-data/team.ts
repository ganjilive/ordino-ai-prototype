import type { TeamMember } from "@/lib/types";

export const seedTeamMembers: TeamMember[] = [
  {
    id: "member-you",
    name: "You",
    email: "gayanjith@gmail.com",
    role: "owner",
    status: "active",
    avatarColor: "var(--ordino-orange)",
  },
  {
    id: "member-priya",
    name: "Priya Nair",
    email: "priya@example.com",
    role: "admin",
    status: "active",
    avatarColor: "var(--ordino-pink)",
  },
  {
    id: "member-diego",
    name: "Diego Alvarez",
    email: "diego@example.com",
    role: "member",
    status: "active",
    avatarColor: "var(--ordino-purple)",
  },
  {
    id: "member-sam",
    name: "Sam Whitfield",
    email: "sam@example.com",
    role: "member",
    status: "pending",
    avatarColor: "var(--ordino-blue)",
  },
];
