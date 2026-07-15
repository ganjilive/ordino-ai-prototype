import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordino — Coding Agent",
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
