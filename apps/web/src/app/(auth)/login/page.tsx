"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import { GraduationCap, ArrowRight, Sparkles, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      // Find matching demo account or login
      const matched = Object.values(DEMO_ACCOUNTS).find(
        (a) => a.email === identifier || a.profile.username === identifier
      );

      if (matched) {
        login(matched.profile, "demo-jwt-token-manual");
        router.push("/");
      } else {
        // Fallback default
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/50 to-indigo-50/30 p-4 sm:p-6">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-200">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Superapp SMKN 1 Garut
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Satu pintu akses platform akademik, absensi digital, tugas, konseling, sarpras, kantin, dan ISP sekolah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Manual Login Card */}
          <Card className="md:col-span-5 border-slate-200/80 shadow-lg shadow-slate-100">
            <CardHeader>
              <CardTitle>Masuk Akun SSO</CardTitle>
              <CardDescription>
                Masukkan email/username dan password akun sekolah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleManualLogin} className="space-y-4">
                {error && (
                  <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-600">
                    {error}
                  </div>
                )}
                <Input
                  label="Email / Username"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nisn / nip / email"
                  required
                />
                <Input
                  label="Kata Sandi"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  isLoading={isLoading}
                >
                  Masuk ke Superapp
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick 1-Click Role Login Picker for Evaluation */}
          <Card className="md:col-span-7 border-sky-100 bg-sky-50/40">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-sky-600" />
                <CardTitle className="text-base text-sky-950">
                  Quick Login Demo (Pilih Peran Pengguna)
                </CardTitle>
              </div>
              <CardDescription>
                Klik salah satu kartu di bawah untuk login instan dengan hak akses & antarmuka peran terkait.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {Object.entries(DEMO_ACCOUNTS).map(([roleKey, account]) => (
                  <button
                    key={roleKey}
                    onClick={() => handleQuickRoleLogin(roleKey as UserRole)}
                    className="flex flex-col items-start p-3 rounded-xl border border-white bg-white/90 shadow-sm hover:border-sky-300 hover:shadow-md hover:bg-sky-50/50 transition-all text-left group"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {account.name}
                      </span>
                      <Badge variant="default" className="text-[10px] py-0 px-1.5">
                        {account.title}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-1 line-clamp-1">
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
