import type { Project } from "@/lib/types";

export const seedProjects: Project[] = [
  {
    id: "proj-booking-website",
    name: "Booking Website",
    description: "Customer-facing booking and checkout flow.",
    createdAt: "2026-05-02",
    integrationIds: ["int-github"],
  },
  {
    id: "proj-internal-admin",
    name: "Internal Admin Console",
    description: "Ops dashboard for managing bookings and support tickets.",
    createdAt: "2026-06-11",
    integrationIds: [],
  },
];
