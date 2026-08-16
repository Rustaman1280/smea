"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  GraduationCap,
  Sparkles,
  ChevronDown,
  LogOut,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { user, switchRole, logout } = useAuthStore();
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & School Name */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-md shadow-sky-100 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  SMKN 1 GARUT
                </span>
                <span className="rounded bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">
                  SUPERAPP
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Sistem Terpadu Akademik & Sekolah Kejuruan
              </p>
            </div>
          </Link>

          {/* Right Controls: Role Switcher Demo + User Profile */}
          <div className="flex items-center gap-3">
            {/* Quick Role Switcher Button */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/80 px-3 py-1.5 text-xs font-semibold text-sky-800 transition-all hover:bg-sky-100 hover:border-sky-300 shadow-sm"
              title="Ganti Peran Pengguna untuk Uji Coba"
            >
              <Sparkles className="h-3.5 w-3.5 text-sky-600 animate-pulse" />
              <span className="hidden sm:inline">Role:</span>
              <span className="font-bold text-sky-900">{user.role}</span>
              <ChevronDown className="h-3.5 w-3.5 text-sky-600" />
            </button>

            {/* Profile Avatar & Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-xs font-bold text-white shadow-inner">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  {DEMO_ACCOUNTS[user.role]?.title || user.role}
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

      {/* Role Switcher Modal */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Ganti Peran Akun (Interactive RBAC Demo)"
        description="Pilih akun peran untuk melihat hak akses, fitur, dan tampilan antarmuka yang disesuaikan secara dinamis."
        maxWidth="2xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
          {Object.entries(DEMO_ACCOUNTS).map(([roleKey, account]) => {
            const isCurrent = user.role === roleKey;
            return (
              <button
                key={roleKey}
                onClick={() => {
                  switchRole(roleKey as UserRole);
                  setIsRoleModalOpen(false);
                }}
                className={`flex items-start gap-3 rounded-xl p-3 text-left transition-all border ${
                  isCurrent
                    ? "border-sky-500 bg-sky-50/60 shadow-sm ring-1 ring-sky-500"
                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/80"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isCurrent
                      ? "bg-sky-600 text-white"
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
                  <div className="flex items-center gap-1.5 mt-0.5">
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
