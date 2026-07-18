"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  if (status === "submitted") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <CheckCircle2 className="h-4 w-4 text-success" />
        You&apos;re on the list — we&apos;ll be in touch.
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setStatus("submitted");
      }}
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
    >
      <Input
        type="email"
        required
        placeholder="you@company.com"
        aria-label="Email address"
        className="h-9"
      />
      <Button type="submit" size="lg">
        Join the waitlist
      </Button>
    </form>
  );
}
