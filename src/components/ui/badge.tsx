import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
        variant === "outline"
          ? "border border-indigo-600 text-indigo-600 bg-transparent"
          : "bg-indigo-600 text-white",
        className
      )}
      {...props}
    />
  );
} 