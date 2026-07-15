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
}

export function ProductSurfaceCard({ href, icon: Icon, title, description, cta }: ProductSurfaceCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-lg border border-border bg-card p-4 hover:border-foreground/20"
    >
      <div>
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">{title}</h3>
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
