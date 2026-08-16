"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  CheckCircle2,
  Shield,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AukletLogo } from "@/components/ui/auklet-logo";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuthStore();
  const [identifier, setIdentifier] = useState("siswa@smkn1garut.sch.id");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const matched = Object.values(DEMO_ACCOUNTS).find(
        (a) => a.email === identifier || a.profile.username === identifier
      );

      if (matched) {
        login(matched.profile, "demo-jwt-token-manual");
        router.push("/");
      } else {
        switchRole(UserRole.SISWA);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Gagal melakukan login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = (role: UserRole) => {
    switchRole(role);
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-slate-100">
      <div className="w-full max-w-5xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-slate-900/80 border border-sky-500/30 backdrop-blur-md shadow-lg shadow-sky-950/40">
            <AukletLogo size="lg" variant="colored" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            auklet SMK Super App
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Platform terpadu akademik, presensi QR, tugas LMS, bimbingan konseling, inventaris sarpras, kantin sehat, dan ISP hotspot sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Manual Login Card */}
          <Card className="md:col-span-5 border-slate-800 bg-slate-900/90 text-slate-100 backdrop-blur-md shadow-2xl shadow-black/40">
            <CardHeader>
              <CardTitle className="text-lg text-white">Masuk Akun SSO</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Gunakan email/NISN/NIP dan kata sandi akun sekolah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualLogin} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-rose-500/20 border border-rose-500/40 p-3 text-xs text-rose-300">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Email / NISN / NIP
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="siswa@smkn1garut.sch.id"
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-11 rounded-xl border border-slate-700 bg-slate-950 px-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 font-bold"
                  isLoading={isLoading}
                >
                  Masuk ke Portal Sekolah
                  <ArrowRight className="h-4 w-4" />
                </Button>

                <p className="text-[11px] text-center text-slate-400">
                  Password demo default: <code className="text-sky-300 font-mono">password123</code>
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Quick 1-Click Role Login Picker */}
          <Card className="md:col-span-7 border-sky-900/60 bg-gradient-to-br from-slate-900/90 to-sky-950/40 text-slate-100 backdrop-blur-md shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <CardTitle className="text-base text-white">
                  Quick Login Demo (Pilih Peran Pengguna)
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-400">
                Klik salah satu kartu di bawah untuk login instan dan melihat antarmuka khusus masing-masing peran.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {Object.entries(DEMO_ACCOUNTS).map(([roleKey, account]) => (
                  <button
                    key={roleKey}
                    onClick={() => handleQuickRoleLogin(roleKey as UserRole)}
                    className="flex flex-col items-start p-3 rounded-2xl border border-slate-800 bg-slate-950/80 hover:border-sky-500/80 hover:bg-slate-900 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">
                        {account.name}
                      </span>
                      <Badge variant="default" className="text-[9px] py-0 px-1.5 bg-sky-500 text-slate-950 font-black">
                        {account.title}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {account.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
