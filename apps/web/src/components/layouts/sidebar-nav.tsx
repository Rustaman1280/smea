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
  Compass,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  colorClass: string;
  allowedRoles: UserRole[];
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard Utama",
    href: "/",
    icon: LayoutDashboard,
    colorClass: "text-sky-500 dark:text-sky-400",
    allowedRoles: Object.values(UserRole),
  },
  {
    title: "Absensi Siswa (QR)",
    href: "/absensi-siswa",
    icon: QrCode,
    colorClass: "text-sky-500 dark:text-sky-400",
    section: "Presensi & Kehadiran",
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
    title: "Absen Guru & BKD",
    href: "/absen-guru",
    icon: UserCheck2,
    colorClass: "text-indigo-500 dark:text-indigo-400",
    section: "Presensi & Kehadiran",
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
    title: "BK & Pelanggaran",
    href: "/bk-pelanggaran",
    icon: ShieldAlert,
    colorClass: "text-rose-500 dark:text-rose-400",
    section: "Akademik & Konseling",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU_BK,
      UserRole.WALI_KELAS,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "Mapel & LMS",
    href: "/mata-pelajaran",
    icon: BookOpenCheck,
    colorClass: "text-cyan-500 dark:text-cyan-400",
    section: "Akademik & Konseling",
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
    title: "Project & Jurnal PKL",
    href: "/project-tracker",
    icon: KanbanSquare,
    colorClass: "text-purple-500 dark:text-purple-400",
    section: "Akademik & Konseling",
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU,
      UserRole.WALI_KELAS,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "Ekstrakurikuler",
    href: "/ekskul",
    icon: Trophy,
    colorClass: "text-emerald-500 dark:text-emerald-400",
    section: "Layanan & Fasilitas",
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
    title: "E-Kantin",
    href: "/kantin",
    icon: UtensilsCrossed,
    colorClass: "text-amber-500 dark:text-amber-400",
    section: "Layanan & Fasilitas",
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
    title: "Inventaris Sarpras",
    href: "/inventaris",
    icon: Boxes,
    colorClass: "text-orange-500 dark:text-orange-400",
    section: "Layanan & Fasilitas",
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
    title: "ISP Voucher Hotspot",
    href: "/isp-voucher",
    icon: Wifi,
    colorClass: "text-teal-500 dark:text-teal-400",
    section: "Layanan & Fasilitas",
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

  // Separate dashboard item from numbered module items
  const dashboardItem = accessibleNavs.find((item) => item.href === "/");
  const moduleItems = accessibleNavs.filter((item) => item.href !== "/");

  return (
    <aside className="hidden lg:flex w-64 flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      {/* Glass panel base with subtle clean border */}
      <div className="flex flex-col flex-1 bg-card/60 dark:bg-[#080d18]/70 backdrop-blur-xl border-r border-border/80 p-4">

        {/* Current Portal Badge */}
        <div className="mb-4 px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Portal {DEMO_ACCOUNTS[user.role]?.title || user.role}
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold text-sky-600 dark:text-sky-300">
            {accessibleNavs.length} Menu
          </span>
        </div>

        {/* Dashboard Main Item */}
        {dashboardItem && (
          <div className="mb-3">
            <Link
              href={dashboardItem.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-xs font-medium transition-all duration-150",
                pathname === "/"
                  ? "bg-sky-500/15 text-sky-700 dark:text-white border border-sky-500/40 shadow-[inset_3px_0_0_rgba(14,165,233,0.8)] font-semibold"
                  : "text-muted-foreground border border-transparent hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-all duration-150",
                  pathname === "/"
                    ? "bg-sky-500/20 text-sky-600 dark:text-sky-400"
                    : "bg-muted text-muted-foreground group-hover:bg-sky-500/15 group-hover:text-sky-500"
                )}
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{dashboardItem.title}</span>
              {pathname === "/" && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-500" />
              )}
            </Link>
          </div>
        )}

        {/* Section label with high contrast */}
        <div className="mb-2 px-2 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Modul Pembelajaran & Layanan
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">
            1 - {moduleItems.length}
          </span>
        </div>

        {/* Dynamic Numbered Module Items */}
        <nav className="space-y-1">
          {moduleItems.map((item, index) => {
            const Icon = item.icon;
            const dynamicNumber = index + 1;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-sky-500/15 text-sky-700 dark:text-white border border-sky-500/40 shadow-[inset_3px_0_0_rgba(14,165,233,0.8)] font-semibold"
                    : "text-muted-foreground border border-transparent hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {/* Dynamic Sequential Number Badge */}
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold font-mono transition-colors",
                    isActive
                      ? "bg-sky-500 text-white dark:text-slate-950"
                      : "bg-muted text-muted-foreground group-hover:bg-sky-500/20 group-hover:text-sky-600 dark:group-hover:text-sky-300"
                  )}
                >
                  {dynamicNumber}
                </span>

                {/* Icon container */}
                <div
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-150 shrink-0",
                    isActive
                      ? `bg-sky-500/20 ${item.colorClass}`
                      : `text-muted-foreground group-hover:${item.colorClass}`
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span className="truncate">{item.title}</span>

                {/* Active indicator pill */}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-500 shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Info Box */}
        <div className="mt-auto pt-6 px-1">
          <div className="rounded-2xl border border-border/80 bg-card/50 p-3.5">
            <div className="flex items-center gap-2 mb-1">
              <Compass className="h-4 w-4 text-sky-500 dark:text-sky-400" />
              <p className="text-xs font-semibold text-foreground">auklet SMK Super App</p>
            </div>
            <p className="text-[10px] text-muted-foreground">
              SMKN 1 Garut · TA 2025/2026
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
