"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { useTheme } from "@/components/providers/theme-provider";
import { UserRole } from "@superapp/types";
import {
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  CheckCircle2,
  Bell,
  Sun,
  Moon,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { AukletLogo } from "@/components/ui/auklet-logo";

export function Navbar() {
  const { user, switchRole, logout } = useAuthStore();
  const { resolvedTheme, toggleTheme } = useTheme();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  if (!user) return null;

  const currentRoleInfo = DEMO_ACCOUNTS[user.role];

  return (
    <>
      {/* ── NAVBAR ── macOS frosted glass top bar */}
      <header className="sticky top-0 z-40 transition-colors duration-200 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo & School Name */}
          <Link href="/" className="flex items-center group" aria-label="Beranda Dashboard SMKN 1 Garut">
            <div className="relative">
              <AukletLogo size="md" />
            </div>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Quick Role Switcher Button — Clean static border, glow on hover only */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-sky-500/25 bg-sky-500/10 px-3 py-2 min-h-[40px] text-xs font-medium text-sky-600 dark:text-sky-200 transition-all duration-150 hover:border-sky-400/50 hover:bg-sky-500/20 hover:text-sky-900 dark:hover:text-white hover:shadow-[0_4px_16px_rgba(14,165,233,0.25)] active:scale-95 backdrop-blur-sm"
              title="Ganti Peran Pengguna (Role Switcher)"
              aria-label="Ganti peran pengguna simulasi"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400 animate-pulse" />
              <span className="hidden sm:inline text-muted-foreground font-normal">
                Peran:
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {currentRoleInfo?.title || user.role}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-sky-500 dark:text-sky-400" />
            </button>

            {/* Dark/Light Mode Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative rounded-xl p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-colors"
              title={resolvedTheme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
              aria-label={resolvedTheme === "dark" ? "Beralih ke Mode Terang" : "Beralih ke Mode Gelap"}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-sky-600 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative rounded-xl p-2.5 min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.08] hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Notifikasi"
                aria-label="Lihat notifikasi aktivitas"
              >
                <Bell className="h-4 w-4" />
                {/* Pulsing indicator dot */}
                <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
                </span>
              </button>

              {/* Notification dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="bg-card/95 backdrop-blur-2xl border border-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                    <div className="p-3.5">
                      <div className="flex items-center justify-between pb-2.5 border-b border-border">
                        <span className="text-xs font-semibold text-foreground">
                          Notifikasi & Aktivitas
                        </span>
                        <span className="text-[11px] text-sky-500 dark:text-sky-400 font-medium cursor-pointer hover:underline transition-colors">
                          Tandai dibaca
                        </span>
                      </div>

                      <div className="space-y-2 mt-2.5 max-h-64 overflow-y-auto">
                        {/* Notif item 1 — success */}
                        <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                            <p className="font-semibold text-foreground">
                              Presensi Berhasil Terverifikasi
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground pl-3 leading-relaxed">
                            Scan QR Code sesi pagi tercatat tepat waktu (07:05 WIB).
                          </p>
                        </div>

                        {/* Notif item 2 — info */}
                        <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                            <p className="font-semibold text-foreground">
                              Voucher Hotspot Aktif
                            </p>
                          </div>
                          <p className="text-[11px] text-muted-foreground pl-3 leading-relaxed">
                            Sisa kuota hotspot Anda 18 Jam (Unlimited 15 Mbps).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-6 w-px bg-border" />

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-2.5">
              {/* Avatar */}
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-indigo-700 dark:from-sky-900/80 dark:via-indigo-950 dark:to-slate-900 text-xs font-bold text-white border border-sky-500/30">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>

              {/* Name + role text with high contrast */}
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-foreground leading-tight truncate max-w-[130px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {currentRoleInfo?.subtitle?.split("·")[0] || user.role}
                </p>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Logout"
                aria-label="Keluar dari akun"
                className="rounded-lg p-2 text-muted-foreground hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-300 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Switcher Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Ganti Peran Pengguna (Multi-Role Portal Switcher)"
        description="Pilih akun simulasi di bawah untuk berganti portal dashboard dan menguji hak akses masing-masing modul secara instan."
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 max-h-[460px] overflow-y-auto pr-1">
          {Object.entries(DEMO_ACCOUNTS).map(([roleKey, account]) => {
            const isCurrent = user.role === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => {
                  switchRole(roleKey as UserRole);
                  setIsRoleModalOpen(false);
                }}
                className={`flex items-start gap-3 rounded-2xl p-3.5 text-left transition-all duration-150 border ${
                  isCurrent
                    ? "border-sky-500 bg-sky-50 dark:border-sky-500/60 dark:bg-sky-500/15 ring-1 ring-sky-500/30 shadow-sm dark:shadow-[0_4px_20px_rgba(14,165,233,0.15)]"
                    : "border-border bg-card hover:border-sky-400/40 hover:bg-muted/50 hover:shadow-sm"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-semibold ${
                    isCurrent
                      ? "bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {account.name}
                    </span>
                    {isCurrent && (
                      <CheckCircle2 className="h-4 w-4 text-sky-500 dark:text-sky-400 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={isCurrent ? "default" : "secondary"}>
                      {account.title}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {account.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
