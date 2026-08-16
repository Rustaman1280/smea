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
  ShieldAlert,
  UtensilsCrossed,
  Trophy,
  BookOpenCheck,
  KanbanSquare,
  Boxes,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  allowedRoles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard Utama",
    href: "/",
    icon: LayoutDashboard,
    allowedRoles: Object.values(UserRole),
  },
  {
    title: "1. Absensi Siswa (QR)",
    href: "/absensi-siswa",
    icon: QrCode,
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
    allowedRoles: [
      UserRole.SISWA,
      UserRole.GURU_BK,
      UserRole.WALI_KELAS,
      UserRole.ADMIN,
      UserRole.KEPSEK,
    ],
  },
  {
    title: "4. Showcase Kantin",
    href: "/kantin",
    icon: UtensilsCrossed,
    allowedRoles: Object.values(UserRole),
  },
  {
    title: "5. Ekstrakurikuler",
    href: "/ekskul",
    icon: Trophy,
    allowedRoles: Object.values(UserRole),
  },
  {
    title: "6. Mapel & Tugas LMS",
    href: "/mata-pelajaran",
    icon: BookOpenCheck,
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
    <aside className="hidden lg:flex w-64 flex-col shrink-0 border-r border-slate-200/80 bg-white/70 backdrop-blur-sm p-4 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="mb-3 px-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Modul & Layanan Sekolah
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
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150",
                isActive
                  ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-slate-700"
                )}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-3">
        <div className="rounded-xl bg-gradient-to-br from-sky-50 to-indigo-50/50 p-3 border border-sky-100/80">
          <p className="text-[11px] font-bold text-sky-900">SMKN 1 Garut</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Tahun Ajaran 2025/2026 · Semester Ganjil
          </p>
        </div>
      </div>
    </aside>
  );
}
