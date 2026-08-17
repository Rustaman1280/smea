import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "gradient";
  size?: "default" | "sm" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060b14] disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]";

    const variants = {
      // Primary: solid sky-blue, clean static, soft natural glow on hover only
      default:
        "bg-sky-500 text-slate-950 font-semibold hover:bg-sky-400 hover:shadow-[0_4px_16px_rgba(14,165,233,0.35)] active:bg-sky-600",
      // Gradient: sky to indigo, clean static, glowing lift on hover only
      gradient:
        "bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium hover:from-sky-400 hover:to-indigo-400 hover:shadow-[0_4px_18px_rgba(14,165,233,0.3)] hover:-translate-y-0.5",
      // Destructive: rose red
      destructive:
        "bg-rose-500/90 text-white font-medium hover:bg-rose-500 hover:shadow-[0_4px_16px_rgba(244,63,94,0.3)] active:bg-rose-600",
      // Outline: subtle glass with blue border, vibrant hover
      outline:
        "border border-sky-500/30 bg-sky-500/5 text-sky-300 hover:border-sky-400/60 hover:bg-sky-500/15 hover:text-white hover:shadow-[0_0_15px_rgba(14,165,233,0.15)]",
      // Secondary: neutral dark glass, crisp text
      secondary:
        "border border-white/[0.08] bg-white/[0.05] text-slate-200 hover:bg-white/[0.09] hover:border-white/[0.15] hover:text-white",
      // Ghost: clear slate-300 text
      ghost:
        "text-slate-300 hover:bg-white/[0.06] hover:text-white",
      // Link: vibrant sky accent with underline on hover
      link:
        "text-sky-400 font-medium underline-offset-4 hover:underline hover:text-sky-300",
    };

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-2xl px-6 text-base font-semibold",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
