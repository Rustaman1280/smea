"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  LayoutDashboard,
  QrCode,
  UserCheck2,
  BookOpenCheck,
  UtensilsCrossed,
  ShieldAlert,
  Wifi,
  Boxes,
  KanbanSquare,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  // Role-specific bottom navigation tabs
  const getNavItems = () => {
    switch (user.role) {
      case UserRole.SISWA:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Absen QR", href: "/absensi-siswa", icon: QrCode },
          { label: "Mapel", href: "/mata-pelajaran", icon: BookOpenCheck },
          { label: "Proyek", href: "/project-tracker", icon: KanbanSquare },
          { label: "Kantin", href: "/kantin", icon: UtensilsCrossed },
        ];
      case UserRole.GURU:
      case UserRole.WALI_KELAS:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Absen Guru", href: "/absen-guru", icon: UserCheck2 },
          { label: "Mapel & Nilai", href: "/mata-pelajaran", icon: BookOpenCheck },
          { label: "Proyek Siswa", href: "/project-tracker", icon: KanbanSquare },
          { label: "Absen Kelas", href: "/absensi-siswa", icon: QrCode },
        ];
      case UserRole.GURU_BK:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Kasus BK", href: "/bk-pelanggaran", icon: ShieldAlert },
          { label: "Absensi", href: "/absensi-siswa", icon: QrCode },
          { label: "Absen Guru", href: "/absen-guru", icon: UserCheck2 },
        ];
      case UserRole.OPERATOR_KANTIN:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Kelola Menu", href: "/kantin", icon: UtensilsCrossed },
        ];
      case UserRole.OPERATOR_ISP:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Jual Voucher", href: "/isp-voucher", icon: Wifi },
        ];
      case UserRole.PETUGAS_SARPRAS:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Sarpras", href: "/inventaris", icon: Boxes },
        ];
      default:
        return [
          { label: "Home", href: "/", icon: LayoutDashboard },
          { label: "Absensi", href: "/absensi-siswa", icon: QrCode },
          { label: "Mapel", href: "/mata-pelajaran", icon: BookOpenCheck },
          { label: "Sarpras", href: "/inventaris", icon: Boxes },
          { label: "Hotspot", href: "/isp-voucher", icon: Wifi },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/95 backdrop-blur-md px-2 py-2">
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
                "flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-semibold transition-all",
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
              <span className="truncate max-w-[56px] text-center">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
