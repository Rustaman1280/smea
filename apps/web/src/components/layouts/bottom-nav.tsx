"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  QrCode,
  BookOpenCheck,
  UtensilsCrossed,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const navItems = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Absen QR", href: "/absensi-siswa", icon: QrCode },
    { label: "Mapel", href: "/mata-pelajaran", icon: BookOpenCheck },
    { label: "Kantin", href: "/kantin", icon: UtensilsCrossed },
    { label: "Semua", href: "/project-tracker", icon: Layers },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-3 py-2">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-3 py-1 text-[10px] font-semibold transition-all",
                isActive
                  ? "text-sky-600 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform",
                  isActive ? "bg-sky-100 text-sky-600 scale-110" : ""
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
