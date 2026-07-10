import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "booking-website — Visual Studio Code",
};

export default function IdeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
