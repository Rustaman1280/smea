import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "success"
    | "warning"
    | "info";
}

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    // Sky-blue accent badge — crisp and clean without muddy static shadow
    default:
      "bg-sky-500/15 text-sky-300 border-sky-500/30 font-medium",
    // Muted dark glass badge — clear contrast
    secondary:
      "bg-white/[0.06] text-slate-300 border-white/[0.1] font-medium",
    // Rose red destructive badge
    destructive:
      "bg-rose-500/15 text-rose-300 border-rose-500/30 font-medium",
    // Outline badge
    outline:
      "border border-white/20 text-slate-200 bg-transparent font-medium",
    // Emerald green success badge
    success:
      "bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-medium",
    // Amber yellow warning badge
    warning:
      "bg-amber-500/15 text-amber-300 border-amber-500/30 font-medium",
    // Indigo info badge
    info:
      "bg-indigo-500/15 text-indigo-300 border-indigo-500/30 font-medium",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs tracking-wide transition-colors",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
