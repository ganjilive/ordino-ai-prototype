import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductSurfaceCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  cta: string;
  target?: string;
  rel?: string;
  size?: "default" | "lg";
}

export function ProductSurfaceCard({
  href,
  icon: Icon,
  title,
  description,
  cta,
  target,
  rel,
  size = "default",
}: ProductSurfaceCardProps) {
  const isLg = size === "lg";
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(
        "group flex flex-col justify-between rounded-lg border border-border bg-card hover:border-foreground/20",
        isLg ? "p-6" : "p-4",
      )}
    >
      <div>
        <div
          className={cn(
            "flex items-center justify-center rounded-md bg-accent",
            isLg ? "h-11 w-11" : "h-9 w-9",
          )}
        >
          <Icon className={cn(isLg ? "h-5 w-5" : "h-4 w-4", "text-muted-foreground")} />
        </div>
        <h3 className={cn("mt-3 font-semibold", isLg ? "text-base" : "text-sm")}>{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <span
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "mt-3 w-fit justify-start px-0 text-muted-foreground group-hover:text-foreground",
        )}
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
