import React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium uppercase tracking-wider text-slate-300"
          >
            {label}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 py-2 text-sm text-white placeholder:text-slate-500 transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-white/[0.2] focus-visible:border-sky-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:bg-[#0c1626] disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500/60 focus-visible:border-rose-500 focus-visible:ring-rose-500/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-slate-400">{helperText}</p>
        )}
        {error && <p className="text-xs font-medium text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
