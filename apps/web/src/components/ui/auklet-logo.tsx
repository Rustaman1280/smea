import React from "react";
import { cn } from "@/lib/utils";

interface AukletLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  variant?: "dark" | "light" | "colored";
}

export function AukletLogo({
  className,
  size = "md",
  showText = true,
  variant = "colored",
}: AukletLogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
    xl: "h-14 w-14",
  };

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  };

  const subtextClasses = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-[11px]",
    xl: "text-xs",
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* Razorbill Seabird Geometric Emblem */}
      <div
        className={cn(
          "relative flex items-center justify-center rounded-2xl p-1.5 shadow-md transition-transform duration-200 hover:scale-105",
          sizeClasses[size],
          variant === "colored" &&
            "bg-gradient-to-br from-slate-900 via-sky-950 to-sky-900 border border-sky-500/30 text-white shadow-sky-950/20",
          variant === "dark" &&
            "bg-slate-950 border border-slate-800 text-white",
          variant === "light" &&
            "bg-white border border-slate-200 text-slate-900"
        )}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full drop-shadow-sm"
        >
          {/* Head & Back Feather Silhouette (Dark Obsidian Plumage) */}
          <path
            d="M8 38C10 26 18 10 32 8C39 7 42 12 40 18C38 23 32 26 26 29C20 32 14 36 8 38Z"
            fill="#0F172A"
          />
          {/* White Chest Plumage (Razor Snow Contrast) */}
          <path
            d="M14 38C18 33 22 28 26 24C24 29 20 35 14 38Z"
            fill="#F8FAFC"
          />
          {/* Oceanic Wing Streamline */}
          <path
            d="M18 36C24 30 31 24 38 22C34 26 28 32 20 37C19 37.5 18.5 37 18 36Z"
            fill="#0284C7"
          />
          {/* Razorbill Sharp Beak with Golden Accent Line */}
          <path
            d="M32 8L44 14C43 17 38 18 35 18L32 8Z"
            fill="#090D16"
          />
          {/* Signature Razorbill White/Gold Beak Line */}
          <path
            d="M36 10.5L39 16"
            stroke="#F59E0B"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Alert Seabird Eye */}
          <circle cx="28" cy="14" r="1.8" fill="#F8FAFC" />
          <circle cx="28" cy="14" r="0.9" fill="#0F172A" />
        </svg>

        {/* Subtle Arctic Glow */}
        <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-sky-400 ring-2 ring-white animate-pulse" />
      </div>

      {showText && (
        <div className="flex flex-col leading-none text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-black tracking-tight uppercase text-slate-900",
                textClasses[size]
              )}
            >
              auklet
            </span>
            <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[9px] font-bold text-sky-800 tracking-wider">
              SMK
            </span>
          </div>
          <span
            className={cn(
              "font-medium text-slate-400 mt-0.5 tracking-normal",
              subtextClasses[size]
            )}
          >
            Super App · SMKN 1 Garut
          </span>
        </div>
      )}
    </div>
  );
}
