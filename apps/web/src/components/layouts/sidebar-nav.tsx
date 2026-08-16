"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  LayoutDashboard,
  QrCode,
  UserCheck2,
  ShieldAlert,
  UtensilsCrossed,
  Trophy,
  BookOpenCheck,
  KanbanSquare,
  Boxes,
  Wifi,
  Sparkles,
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  accentColor: string;
  allowedRoles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard Utama",
    href: "/",
    icon: LayoutDashboard,
    accentColor: "text-sky-600 bg-sky-100",
    allowedRoles: Object.values(UserRole),
  },
  {
    title: "1. Absensi Siswa (QR)",
    href: "/absensi-siswa",
    icon: QrCode,
    accentColor: "text-sky-600 bg-sky-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.GURU_BK,
      UserRole.STAFF_TU,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "2. Absen Guru & BKD",
    href: "/absen-guru",
    icon: UserCheck2,
    accentColor: "text-indigo-600 bg-indigo-100",
    allowedRoles: [
      UserRole.GURU,
      UserRole.GURU_BK,
      UserRole.WALI_KELAS,
      UserRole.PEMBINA_EKSKUL,
      UserRole.STAFF_TU,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "3. BK & Pelanggaran",
    href: "/bk-pelanggaran",
    icon: ShieldAlert,
    accentColor: "text-rose-600 bg-rose-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU_BK,
      UserRole.WALI_KELAS,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "4. E-Kantin",
    href: "/kantin",
    icon: UtensilsCrossed,
    accentColor: "text-amber-600 bg-amber-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.PEMBINA_EKSKUL,
      UserRole.STAFF_TU,
      UserRole.PETUGAS_SARPRAS,
      UserRole.OPERATOR_KANTIN,
      UserRole.OPERATOR_ISP,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "5. Ekstrakurikuler",
    href: "/ekskul",
    icon: Trophy,
    accentColor: "text-emerald-600 bg-emerald-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.PEMBINA_EKSKUL,
      UserRole.STAFF_TU,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "6. Mapel & LMS",
    href: "/mata-pelajaran",
    icon: BookOpenCheck,
    accentColor: "text-cyan-600 bg-cyan-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.GURU_BK,
      UserRole.STAFF_TU,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "7. Project & Jurnal PKL",
    href: "/project-tracker",
    icon: KanbanSquare,
    accentColor: "text-purple-600 bg-purple-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "8. Inventaris Sarpras",
    href: "/inventaris",
    icon: Boxes,
    accentColor: "text-orange-600 bg-orange-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.PETUGAS_SARPRAS,
      UserRole.STAFF_TU,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "9. ISP Voucher Hotspot",
    href: "/isp-voucher",
    icon: Wifi,
    accentColor: "text-teal-600 bg-teal-100",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.OPERATOR_ISP,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const accessibleNavs = NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(user.role)
  );

  return (
    <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-md p-4 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      {/* Current Portal Badge */}
      <div className="mb-4 px-2.5 py-2 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="text-xs font-bold tracking-tight">
            Portal {DEMO_ACCOUNTS[user.role]?.title || user.role}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-sky-300">
          {accessibleNavs.length} Menu
        </span>
      </div>

      <div className="mb-2 px-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Modul yang Dapat Diakses
        </p>
      </div>

      <nav className="space-y-1">
        {accessibleNavs.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150",
                isActive
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-300/40"
                  : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-hover:scale-105",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info Box */}
      <div className="mt-auto pt-6 px-1">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-3.5 text-white border border-sky-500/20 shadow-md">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-sky-400" />
            <p className="text-xs font-black tracking-wide">auklet SMK Super App</p>
          </div>
          <p className="text-[10px] text-sky-200/80 mt-1">
            SMKN 1 Garut · Tahun Ajaran 2025/2026
          </p>
        </div>
      </div>
    </aside>
  );
}
