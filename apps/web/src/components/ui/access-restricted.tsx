"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import { ShieldAlert, ArrowLeft, Sparkles, UserCheck2, LockKeyhole } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AccessRestrictedProps {
  moduleTitle: string;
  allowedRoles: UserRole[];
  description?: string;
}

export function AccessRestricted({
  moduleTitle,
  allowedRoles,
  description = "Halaman ini memerlukan hak akses khusus dan tidak tersedia untuk peran akun Anda saat ini.",
}: AccessRestrictedProps) {
  const { user, switchRole } = useAuthStore();

  const recommendedRole = allowedRoles[0];

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <Card className="border-rose-200/80 bg-gradient-to-b from-rose-50/40 via-white to-white shadow-xl shadow-rose-950/5">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
            <LockKeyhole className="h-8 w-8" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Akses Terbatas (Role-Based Access Control)</span>
          </div>
          <CardTitle className="text-xl sm:text-2xl mt-2 text-slate-900">
            Akses Dibatasi: {moduleTitle}
          </CardTitle>
          <CardDescription className="text-sm text-slate-600 max-w-md mx-auto">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Current Role Info */}
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Akun & Peran Anda Saat Ini:
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {DEMO_ACCOUNTS[user?.role || UserRole.SISWA]?.subtitle}
              </p>
            </div>
            <Badge variant="destructive" className="w-fit">
              {user?.role}
            </Badge>
          </div>

          {/* Permitted Roles List */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Peran yang Memiliki Izin Mengakses:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {allowedRoles.map((role) => (
                <span
                  key={role}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                >
                  {DEMO_ACCOUNTS[role]?.title || role}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Demo Switch Action */}
          {recommendedRole && (
            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <span>Uji Coba Cepat (Evaluasi RBAC):</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Anda dapat berganti peran secara instan ke{" "}
                <strong className="text-sky-950">
                  {DEMO_ACCOUNTS[recommendedRole]?.title} (
                  {DEMO_ACCOUNTS[recommendedRole]?.name})
                </strong>{" "}
                untuk melihat antarmuka dan mencoba fitur modul ini.
              </p>
              <Button
                variant="gradient"
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => switchRole(recommendedRole)}
              >
                <UserCheck2 className="h-4 w-4" />
                Beralih ke Peran {DEMO_ACCOUNTS[recommendedRole]?.title}
              </Button>
            </div>
          )}

          {/* Navigation Back */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Dashboard Utama
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
