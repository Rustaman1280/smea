"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  CheckCircle2,
  Bell,
  Shield,
  ExternalLink,
  Wifi,
  Utensils,
  Layers,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { AukletLogo } from "@/components/ui/auklet-logo";

export function Navbar() {
  const { user, switchRole, logout } = useAuthStore();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  if (!user) return null;

  const currentRoleInfo = DEMO_ACCOUNTS[user.role];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center group">
            <AukletLogo size="md" />
          </Link>

          {/* Right Controls: Role Switcher Demo + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Quick Role Switcher Button */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-sky-300/80 bg-gradient-to-r from-sky-50 to-blue-50/70 px-3 py-1.5 text-xs font-bold text-sky-900 transition-all hover:bg-sky-100 hover:border-sky-400 shadow-sm active:scale-95"
              title="Ganti Peran Pengguna (Role Switcher)"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
              <span className="hidden sm:inline text-slate-500 font-semibold">
                Peran:
              </span>
              <span className="font-extrabold text-sky-950">
                {currentRoleInfo?.title || user.role}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-sky-600" />
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Notifikasi"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-500 ring-2 ring-white" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">
                      Notifikasi & Aktivitas
                    </span>
                    <span className="text-[10px] text-sky-600 font-semibold cursor-pointer">
                      Tandai dibaca
                    </span>
                  </div>
                  <div className="space-y-2 mt-2 max-h-64 overflow-y-auto">
                    <div className="p-2 rounded-xl bg-sky-50/70 border border-sky-100 text-xs space-y-1">
                      <p className="font-bold text-sky-950">
                        Presensi Berhasil Terverifikasi
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Scan QR Code sesi pagi tercatat tepat waktu (07:05 WIB).
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                      <p className="font-bold text-slate-800">
                        Voucher Hotspot Aktif
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Sisa kuota hotspot Anda 18 Jam (Unlimited 15 Mbps).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-800 text-xs font-black text-white shadow-inner border border-sky-600/30">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[130px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold">
                  {currentRoleInfo?.subtitle?.split("·")[0] || user.role}
                </p>
              </div>

              <button
                onClick={logout}
                title="Logout"
                className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Switcher Modal (Interactive Multi-Role RBAC Demo) */}
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
                className={`flex items-start gap-3 rounded-2xl p-3.5 text-left transition-all border ${
                  isCurrent
                    ? "border-sky-500 bg-sky-50/70 shadow-sm ring-1 ring-sky-500"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/80 hover:shadow-sm"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
                    isCurrent
                      ? "bg-gradient-to-tr from-sky-600 to-sky-700 text-white shadow-sm shadow-sky-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {account.name}
                    </span>
                    {isCurrent && (
                      <CheckCircle2 className="h-4 w-4 text-sky-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={isCurrent ? "default" : "secondary"}>
                      {account.title}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
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
