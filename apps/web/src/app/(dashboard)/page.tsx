"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore, DEMO_ACCOUNTS } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  QrCode,
  UserCheck,
  ShieldAlert,
  UtensilsCrossed,
  Trophy,
  BookOpenCheck,
  KanbanSquare,
  Boxes,
  Wifi,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Check,
  Store,
  Layers,
  Send,
  Printer,
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, switchRole } = useAuthStore();

  if (!user) return null;

  const demoInfo = DEMO_ACCOUNTS[user.role];

  // Render role-specific tailored dashboards
  switch (user.role) {
    case UserRole.SISWA:
      return <SiswaDashboard user={user} demoInfo={demoInfo} />;
    case UserRole.GURU:
    case UserRole.WALI_KELAS:
      return <GuruDashboard user={user} demoInfo={demoInfo} isWaliKelas={user.role === UserRole.WALI_KELAS} />;
    case UserRole.GURU_BK:
      return <GuruBKDashboard user={user} demoInfo={demoInfo} />;
    case UserRole.OPERATOR_KANTIN:
      return <KantinDashboard user={user} demoInfo={demoInfo} />;
    case UserRole.OPERATOR_ISP:
      return <IspDashboard user={user} demoInfo={demoInfo} />;
    case UserRole.PETUGAS_SARPRAS:
      return <SarprasDashboard user={user} demoInfo={demoInfo} />;
    case UserRole.PEMBINA_EKSKUL:
      return <PembinaEkskulDashboard user={user} demoInfo={demoInfo} />;
    default:
      return <AdminExecutiveDashboard user={user} demoInfo={demoInfo} />;
  }
}

/* =========================================================================
   1. SISWA (STUDENT) PORTAL DASHBOARD
   ========================================================================= */
function SiswaDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      {/* Student Razorbill Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-sky-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-200 border border-sky-400/30 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Portal Siswa · SMK Super App</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Semangat Pagi, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Kelas <strong className="text-white font-bold">XII RPL 1</strong> · NISN:{" "}
              <span className="font-mono text-sky-300">0071234567</span>. Presensi pagi Anda sudah{" "}
              <strong className="text-emerald-400 font-bold">Hadir Tepat Waktu (07:05 WIB)</strong>.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/absensi-siswa">
              <Button variant="default" className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black shadow-lg shadow-sky-500/20">
                <QrCode className="h-4 w-4" />
                Scan QR Presensi
              </Button>
            </Link>
            <Link href="/project-tracker">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <KanbanSquare className="h-4 w-4" />
                Board Proyek RPL
              </Button>
            </Link>
          </div>
        </div>

        {/* Ambient Arctic Highlights */}
        <div className="absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute right-48 -top-8 h-32 w-32 rounded-full bg-blue-500/15 blur-2xl" />
      </div>

      {/* Student 4 Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-sky-200/80 bg-gradient-to-br from-sky-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-sky-900 uppercase">Presensi Hari Ini</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">Hadir (07:05)</h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Tepat Waktu</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-indigo-900 uppercase">Mapel Berikutnya</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">Web & Mobile</h4>
              <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">07:15 · Lab RPL 2</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 bg-gradient-to-br from-amber-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-900 uppercase">Tugas & Praktikum</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">1 Menunggu</h4>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">NestJS CRUD API</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <BookOpenCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-teal-200/80 bg-gradient-to-br from-teal-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-teal-900 uppercase">Wi-Fi Hotspot</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">Aktif (15 Mbps)</h4>
              <p className="text-[11px] text-teal-600 font-semibold mt-0.5">Sisa 18 Jam</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <Wifi className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Schedule & Tasks */}
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Schedule Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Jadwal Pelajaran Hari Ini</CardTitle>
                <CardDescription>Senin · Ruang Lab & Kelas</CardDescription>
              </div>
              <Link href="/mata-pelajaran">
                <Button variant="outline" size="sm" className="text-xs">
                  Semua Jadwal
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80">
                <div className="h-10 w-10 rounded-xl bg-sky-600 text-white font-black flex items-center justify-center text-xs shrink-0">
                  01-03
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      Pemrograman Web & Mobile
                    </h4>
                    <Badge variant="default" className="text-[10px]">Sedang Berlangsung</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Guru: Budi Santoso, S.Kom · Lab RPL 2 (07:15 - 09:30 WIB)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="h-10 w-10 rounded-xl bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                  04-06
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      Bahasa Indonesia Kejuruan
                    </h4>
                    <span className="text-[11px] text-slate-400">09:45 - 12:00 WIB</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Guru: Dra. Hj. Nurhayati · Ruang XII RPL 1
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Practical Project & PKL Journal */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Proyek Produktif & Jurnal PKL</CardTitle>
                <CardDescription>Tugas Praktik Kejuruan SMK</CardDescription>
              </div>
              <Link href="/project-tracker">
                <Button variant="outline" size="sm" className="text-xs">
                  Buka Board
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-950">
                    Aplikasi POS Kasir Kantin Multi-Stand
                  </span>
                  <Badge variant="secondary" className="text-[10px]">In Progress</Badge>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Kelompok 1 RPL: Slicing UI Next.js App Router & Tailwind CSS.
                </p>
                <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-purple-800 font-semibold">
                  <span>Pembimbing: Budi Santoso, S.Kom</span>
                  <span>Deadline: 30 Sept 2026</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Canteen & Wi-Fi & Ekskul */}
        <div className="lg:col-span-5 space-y-6">
          {/* Canteen Specials */}
          <Card className="border-amber-200 bg-gradient-to-b from-amber-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-base">Menu Kantin Favorit Hari Ini</CardTitle>
              </div>
              <Link href="/kantin">
                <span className="text-xs font-bold text-amber-700 hover:underline">Lihat Semua</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-100 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-900">Ayam Geprek Sambal Korek</p>
                  <p className="text-[10px] text-slate-400">Stand 01 - Barokah Ibu Eni</p>
                </div>
                <span className="text-xs font-extrabold text-amber-700">{formatCurrency(13000)}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-amber-100 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-slate-900">Es Teh Manis Jumbo</p>
                  <p className="text-[10px] text-slate-400">Stand 01 - Barokah Ibu Eni</p>
                </div>
                <span className="text-xs font-extrabold text-amber-700">{formatCurrency(3500)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ekskul Club Status */}
          <Card className="border-emerald-200 bg-gradient-to-b from-emerald-50/50 to-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-emerald-600" />
                <CardTitle className="text-base">Ekskul Saya: Robotic & IoT</CardTitle>
              </div>
              <Link href="/ekskul">
                <span className="text-xs font-bold text-emerald-700 hover:underline">Detail</span>
              </Link>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-slate-600">
                Latihan berikutnya: <strong>Kamis, 15:30 WIB</strong> di Lab Hardware IoT.
              </p>
              <div className="p-2 rounded-xl bg-emerald-100/60 text-emerald-900 text-[11px] font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>Persiapan LKS Robotika Provinsi Jawa Barat 2026</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   2. GURU & WALI KELAS PORTAL DASHBOARD
   ========================================================================= */
function GuruDashboard({ user, demoInfo, isWaliKelas }: { user: any; demoInfo: any; isWaliKelas?: boolean }) {
  return (
    <div className="space-y-6">
      {/* Teacher Razorbill Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-200 border border-indigo-400/30 backdrop-blur-md">
              <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Portal Guru · SMKN 1 Garut</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Bertugas, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              NIP: <span className="font-mono text-indigo-300">198501012010011001</span> · Bidang:{" "}
              <strong className="text-white font-bold">Pemrograman Web & Mobile</strong>.
              {isWaliKelas && (
                <span className="block text-sky-300 font-semibold mt-1">
                  ⭐ Anda bertindak sebagai Wali Kelas XII RPL 1 (34 Siswa Terdaftar).
                </span>
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/absen-guru">
              <Button variant="default" className="bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-black shadow-lg shadow-indigo-500/20">
                <UserCheck className="h-4 w-4" />
                Presensi & Log BKD
              </Button>
            </Link>
            <Link href="/mata-pelajaran">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <BookOpenCheck className="h-4 w-4" />
                Kelola Tugas & Nilai
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Teacher Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-indigo-900 uppercase">Presensi Masuk</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">06:48 WIB</h4>
              <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Tepat Waktu</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-sky-200 bg-gradient-to-br from-sky-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-sky-900 uppercase">Jadwal Mengajar</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">6 Jam BKD</h4>
              <p className="text-[11px] text-sky-700 font-semibold mt-0.5">XII RPL 1 & XII RPL 2</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-sm">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-amber-900 uppercase">Tugas Perlu Dinilai</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">32 Pengumpulan</h4>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Praktikum 03 API</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-sm">
              <BookOpenCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50/70 to-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-purple-900 uppercase">Bimbingan Proyek</p>
              <h4 className="text-lg font-black text-slate-900 mt-1">4 Tim TeFa</h4>
              <p className="text-[11px] text-purple-700 font-semibold mt-0.5">1 Menunggu Review</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-sm">
              <KanbanSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid for Teacher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Today's Teaching Schedule */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base">Jadwal Mengajar Hari Ini</CardTitle>
                <CardDescription>Beban Kerja Dosen/Guru (BKD)</CardDescription>
              </div>
              <Link href="/absen-guru">
                <Button variant="outline" size="sm" className="text-xs">
                  Catat Log BKD
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950">
                    XII RPL 1 · Pemrograman Web & Mobile
                  </span>
                  <Badge variant="default" className="text-[10px]">07:15 - 09:30 WIB</Badge>
                </div>
                <p className="text-xs text-slate-600">
                  Topik: Integrasi REST API NestJS dengan Next.js App Router
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-indigo-200/60">
                  <span>Lab RPL 2 · 34 Siswa</span>
                  <span className="text-emerald-700 font-bold">✓ Log BKD Tercatat</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    XII RPL 2 · Pemrograman Web & Mobile
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">09:45 - 12:00 WIB</span>
                </div>
                <p className="text-xs text-slate-600">
                  Topik: State Management Zustand & TanStack React Query
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                  <span>Lab RPL 1 · 32 Siswa</span>
                  <span className="text-amber-700 font-semibold">Sesi Berikutnya</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          {/* Quick Grading Desk */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Antrean Koreksi Tugas</CardTitle>
              <CardDescription>Pengumpulan tugas siswa terbaru</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Ahmad Fauzi (XII RPL 1)</span>
                  <Badge variant="success" className="text-[10px]">Nilai: 95</Badge>
                </div>
                <p className="text-slate-500 text-[11px]">Praktikum 03: REST API NestJS</p>
              </div>

              <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Bima Pratama (XII RPL 1)</span>
                  <Badge variant="warning" className="text-[10px]">Belum Dinilai</Badge>
                </div>
                <p className="text-slate-600 text-[11px]">Praktikum 03: REST API NestJS</p>
                <Link href="/mata-pelajaran" className="block pt-1 text-[11px] text-sky-700 font-bold">
                  Beri Nilai & Review →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Wali Kelas Special Section if applicable */}
          {isWaliKelas && (
            <Card className="border-sky-200 bg-gradient-to-br from-sky-50/80 to-white">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600" />
                  <CardTitle className="text-base">Perwalian: XII RPL 1</CardTitle>
                </div>
                <CardDescription>Rekap kehadiran & kasus siswa asuh</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-sky-100">
                  <span className="text-slate-600">Kehadiran Kelas Hari Ini:</span>
                  <strong className="text-emerald-700 font-bold">94% (32/34 Hadir)</strong>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-600">Catatan BK / Poin:</span>
                  <strong className="text-amber-700 font-bold">1 Siswa Perlu Perhatian</strong>
                </div>
                <Link href="/absensi-siswa" className="block pt-2">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    Pantau Rekap Kelas XII RPL 1
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. GURU BK (COUNSELOR) PORTAL DASHBOARD
   ========================================================================= */
function GuruBKDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      {/* BK Razorbill Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-rose-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-200 border border-rose-400/30 backdrop-blur-md">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              <span>Portal Bimbingan Konseling & Kedisiplinan Siswa</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Halo, {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Pusat monitoring poin pelanggaran tata tertib, bimbingan konseling individual, dan penerbitan Surat Panggilan Orang Tua resmi.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link href="/bk-pelanggaran">
              <Button variant="default" className="bg-rose-600 hover:bg-rose-500 text-white font-black shadow-lg shadow-rose-600/20">
                <ShieldAlert className="h-4 w-4" />
                Input Kasus & Cetak Surat
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* BK Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-rose-200 bg-rose-50/40">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-rose-900 uppercase">Kasus Aktif</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">2 Kasus</h4>
            <p className="text-[11px] text-rose-700 font-semibold mt-0.5">Bulan Agustus 2026</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/40">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-amber-900 uppercase">Pelanggaran Ringan</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">1 Siswa</h4>
            <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Terlambat 3x (10 Poin)</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 bg-purple-50/40">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-purple-900 uppercase">Panggilan Ortu</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">1 Surat</h4>
            <p className="text-[11px] text-purple-700 font-semibold mt-0.5">Bolos Pelajaran</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-900 uppercase">Indeks Kedisiplinan</p>
            <h4 className="text-2xl font-black text-emerald-800 mt-1">98.2%</h4>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Status: Sangat Tertib</p>
          </CardContent>
        </Card>
      </div>

      {/* BK Quick Access List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle>Daftar Tindak Lanjut Siswa (Perhatian Khusus)</CardTitle>
            <CardDescription>Berdasarkan akumulasi bobot poin pelanggaran</CardDescription>
          </div>
          <Link href="/bk-pelanggaran">
            <Button variant="outline" size="sm">Buka Modul BK Lengkap</Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-2xl border border-rose-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">Bima Pratama</span>
                <Badge variant="destructive">25 Poin (Sedang)</Badge>
                <span className="text-xs text-slate-400">XII RPL 1</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Meninggalkan kelas tanpa izin (Bolos) pada jam ke 5-6 · Status: <strong>Perlu Panggilan Orang Tua</strong>
              </p>
            </div>
            <Link href="/bk-pelanggaran">
              <Button variant="default" size="sm" className="bg-rose-600 hover:bg-rose-700 text-xs">
                <Printer className="h-3.5 w-3.5" />
                Cetak Surat Ortu
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================================
   4. PETUGAS KANTIN PORTAL DASHBOARD
   ========================================================================= */
function KantinDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-amber-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-amber-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-200 border border-amber-400/30 backdrop-blur-md">
              <Store className="h-3.5 w-3.5 text-amber-400" />
              <span>Portal Operator Kantin Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pengelola <strong>Stand 01 - Barokah Ibu Eni</strong>. Kelola stok makanan/minuman habis dan update harga katalog digital.
            </p>
          </div>

          <Link href="/kantin">
            <Button variant="default" className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <UtensilsCrossed className="h-4 w-4" />
              Buka Katalog & Kelola Menu
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-amber-200 bg-amber-50/40">
          <p className="text-xs font-bold text-amber-900">Total Menu Aktif</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">6 Menu</h4>
        </Card>
        <Card className="p-4 border-emerald-200 bg-emerald-50/40">
          <p className="text-xs font-bold text-emerald-900">Menu Tersedia</p>
          <h4 className="text-2xl font-black text-emerald-700 mt-1">5 Tersedia</h4>
        </Card>
        <Card className="p-4 border-rose-200 bg-rose-50/40">
          <p className="text-xs font-bold text-rose-900">Stok Habis</p>
          <h4 className="text-2xl font-black text-rose-700 mt-1">1 Habis</h4>
        </Card>
        <Card className="p-4 border-sky-200 bg-sky-50/40">
          <p className="text-xs font-bold text-sky-900">Status Stand</p>
          <h4 className="text-xl font-black text-emerald-700 mt-1">BUKA (07:00 - 15:00)</h4>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manajemen Cepat Ketersediaan Menu</CardTitle>
          <CardDescription>Ubah status menu habis secara real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/kantin">
            <Button variant="gradient" className="from-amber-600 to-amber-700">
              Menuju Showcase Kantin Lengkap →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================================
   5. PETUGAS ISP (TKJ TEFA) PORTAL DASHBOARD
   ========================================================================= */
function IspDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-teal-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-200 border border-teal-400/30 backdrop-blur-md">
              <Wifi className="h-3.5 w-3.5 text-teal-400" />
              <span>Teaching Factory ISP & Unit Produksi TKJ</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user.name} (Operator ISP Hotspot) 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Unit bisnis internet mandiri siswa TKJ SMKN 1 Garut. Manajemen voucher hotspot MikroTik, analitik omset, dan cetak massal kode voucher.
            </p>
          </div>

          <Link href="/isp-voucher">
            <Button variant="default" className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-black shadow-lg shadow-teal-500/20">
              <Zap className="h-4 w-4" />
              Buka Panel Voucher & Penjualan
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-teal-200 bg-teal-50/40">
          <p className="text-xs font-bold text-teal-900">Total Voucher Dibuat</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">250 Unit</h4>
        </Card>
        <Card className="p-4 border-emerald-200 bg-emerald-50/40">
          <p className="text-xs font-bold text-emerald-900">Voucher Terjual</p>
          <h4 className="text-2xl font-black text-emerald-700 mt-1">182 Unit</h4>
        </Card>
        <Card className="p-4 border-sky-200 bg-sky-50/40">
          <p className="text-xs font-bold text-sky-900">Stok Tersedia</p>
          <h4 className="text-2xl font-black text-sky-700 mt-1">68 Unit</h4>
        </Card>
        <Card className="p-4 border-purple-200 bg-purple-50/40">
          <p className="text-xs font-bold text-purple-900">Total Omset Kas TeFa</p>
          <h4 className="text-xl font-black text-purple-700 mt-1">{formatCurrency(685000)}</h4>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Operasional Hotspot MikroTik</CardTitle>
          <CardDescription>Integrasi RouterOS RADIUS Server & Cetak Tiket</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/isp-voucher">
            <Button variant="gradient" className="from-teal-600 to-emerald-600">
              Generate Batch Voucher Baru →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================================
   6. PETUGAS SARPRAS PORTAL DASHBOARD
   ========================================================================= */
function SarprasDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-orange-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-orange-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-200 border border-orange-400/30 backdrop-blur-md">
              <Boxes className="h-3.5 w-3.5 text-orange-400" />
              <span>Portal Sarana & Prasarana Sekolah</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user.name} (Petugas Sarpras) 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pengelolaan aset alat praktikum lab kejuruan (RPL, TKJ, Otomotif) dan persetujuan checkout peminjaman barang.
            </p>
          </div>

          <Link href="/inventaris">
            <Button variant="default" className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black shadow-lg shadow-orange-500/20">
              <Boxes className="h-4 w-4" />
              Kelola Aset & Peminjaman
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-orange-200 bg-orange-50/40">
          <p className="text-xs font-bold text-orange-900">Total Jenis Barang</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">5 Master Aset</h4>
        </Card>
        <Card className="p-4 border-amber-200 bg-amber-50/40">
          <p className="text-xs font-bold text-amber-900">Peminjaman Aktif</p>
          <h4 className="text-2xl font-black text-amber-700 mt-1">1 Dipinjam</h4>
        </Card>
        <Card className="p-4 border-sky-200 bg-sky-50/40">
          <p className="text-xs font-bold text-sky-900">Menunggu Approval</p>
          <h4 className="text-2xl font-black text-sky-700 mt-1">1 Pengajuan</h4>
        </Card>
        <Card className="p-4 border-emerald-200 bg-emerald-50/40">
          <p className="text-xs font-bold text-emerald-900">Kondisi Baik</p>
          <h4 className="text-2xl font-black text-emerald-700 mt-1">100% Siap Pakai</h4>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Antrean Persetujuan Peminjaman Sarpras</CardTitle>
          <CardDescription>Verifikasi pengajuan pinjam alat praktikum lab</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/inventaris">
            <Button variant="gradient" className="from-orange-600 to-amber-600">
              Buka Modul Inventaris Lengkap →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/* =========================================================================
   7. PEMBINA EKSKUL PORTAL DASHBOARD
   ========================================================================= */
function PembinaEkskulDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-200 border border-emerald-400/30 backdrop-blur-md">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <span>Portal Pembina Ekstrakurikuler</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {user.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Pembina <strong>Robotic & IoT Club SMKN 1 Garut</strong>. Kelola keanggotaan klub, absensi latihan mingguan, dan publikasi piagam kejuaraan.
            </p>
          </div>

          <Link href="/ekskul">
            <Button variant="default" className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Trophy className="h-4 w-4" />
              Buka Panel Ekskul & Prestasi
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-emerald-200 bg-emerald-50/40">
          <p className="text-xs font-bold text-emerald-900">Total Anggota Klub</p>
          <h4 className="text-2xl font-black text-slate-900 mt-1">28 Siswa</h4>
        </Card>
        <Card className="p-4 border-amber-200 bg-amber-50/40">
          <p className="text-xs font-bold text-amber-900">Prestasi Kejuaraan</p>
          <h4 className="text-2xl font-black text-amber-700 mt-1">2 Gelar</h4>
        </Card>
        <Card className="p-4 border-sky-200 bg-sky-50/40">
          <p className="text-xs font-bold text-sky-900">Jadwal Latihan</p>
          <h4 className="text-xl font-black text-sky-900 mt-1">Kamis, 15:30</h4>
        </Card>
        <Card className="p-4 border-purple-200 bg-purple-50/40">
          <p className="text-xs font-bold text-purple-900">Target Lomba</p>
          <h4 className="text-xl font-black text-purple-800 mt-1">LKS Prov. Jabar</h4>
        </Card>
      </div>
    </div>
  );
}

/* =========================================================================
   8. ADMIN & KEPALA SEKOLAH EXECUTIVE MASTER DASHBOARD
   ========================================================================= */
function AdminExecutiveDashboard({ user, demoInfo }: { user: any; demoInfo: any }) {
  return (
    <div className="space-y-6">
      {/* Master Razorbill Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl border border-sky-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/20 px-3 py-1 text-xs font-bold text-sky-200 border border-sky-400/30 backdrop-blur-md">
              <Shield className="h-3.5 w-3.5 text-sky-300" />
              <span>Executive Master Console · SMKN 1 Garut</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Executive Console: {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Hak akses administrator penuh atas 9 modul inti sekolah kejuruan, rekapitulasi kehadiran dewan guru & siswa, dan kontrol eksekutif.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Schoolwide Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-sky-200 bg-gradient-to-br from-sky-50/70 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-sky-900 uppercase">Kehadiran Guru</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">48 / 48 Hadir</h4>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">100% Hari Ini</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/70 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-emerald-900 uppercase">Kehadiran Siswa</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">98.4%</h4>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">1.420 Siswa Hadir</p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-gradient-to-br from-teal-50/70 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-teal-900 uppercase">Pendapatan ISP TeFa</p>
            <h4 className="text-2xl font-black text-teal-900 mt-1">{formatCurrency(685000)}</h4>
            <p className="text-[11px] text-teal-600 font-bold mt-0.5">182 Voucher Terjual</p>
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-gradient-to-br from-rose-50/70 to-white">
          <CardContent className="p-4">
            <p className="text-xs font-bold text-rose-900 uppercase">Kasus Kedisiplinan</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1">2 Kasus</h4>
            <p className="text-[11px] text-rose-600 font-bold mt-0.5">1 Panggilan Ortu</p>
          </CardContent>
        </Card>
      </div>

      {/* Directory of all 9 modules for Master Admin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Pusat 9 Modul & Layanan Sekolah (Full Access)
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            Single Sign-On Terintegrasi
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ModuleCard
            href="/absensi-siswa"
            title="1. Absensi Digital Siswa"
            desc="Presensi QR Code dinamis harian & rekap kehadiran per kelas real-time."
            badge="Modul 1"
            icon={QrCode}
            color="bg-sky-100 text-sky-700 group-hover:bg-sky-600"
          />
          <ModuleCard
            href="/absen-guru"
            title="2. Absen Guru & BKD"
            desc="Check-in guru masuk/pulang, log jam mengajar per kelas & laporan BKD."
            badge="Modul 2"
            icon={UserCheck}
            color="bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600"
          />
          <ModuleCard
            href="/bk-pelanggaran"
            title="3. BK & Pelanggaran"
            desc="Poin pelanggaran, rekam sesi konseling & cetak otomatis Surat Panggilan Ortu."
            badge="Modul 3"
            icon={ShieldAlert}
            color="bg-rose-100 text-rose-700 group-hover:bg-rose-600"
          />
          <ModuleCard
            href="/kantin"
            title="4. Showcase Kantin"
            desc="Katalog menu digital per stand kantin & update status stok habis real-time."
            badge="Modul 4"
            icon={UtensilsCrossed}
            color="bg-amber-100 text-amber-700 group-hover:bg-amber-600"
          />
          <ModuleCard
            href="/ekskul"
            title="5. Ekstrakurikuler"
            desc="Pendaftaran ekskul online, jadwal latihan, absensi anggota & rekam piagam."
            badge="Modul 5"
            icon={Trophy}
            color="bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600"
          />
          <ModuleCard
            href="/mata-pelajaran"
            title="6. Mapel & LMS"
            desc="Materi pelajaran digital (PDF/video), tugas terstruktur & penilaian otomatis guru."
            badge="Modul 6"
            icon={BookOpenCheck}
            color="bg-cyan-100 text-cyan-700 group-hover:bg-cyan-600"
          />
          <ModuleCard
            href="/project-tracker"
            title="7. Project & Jurnal PKL"
            desc="Board Kanban proyek produktif SMK, repository GitHub & jurnal harian PKL."
            badge="Modul 7"
            icon={KanbanSquare}
            color="bg-purple-100 text-purple-700 group-hover:bg-purple-600"
          />
          <ModuleCard
            href="/inventaris"
            title="8. Inventaris Sarpras"
            desc="Katalog aset lab & alat praktik, pengajuan peminjaman (checkout) & log maintenance."
            badge="Modul 8"
            icon={Boxes}
            color="bg-orange-100 text-orange-700 group-hover:bg-orange-600"
          />
          <ModuleCard
            href="/isp-voucher"
            title="9. ISP Jual Voucher Hotspot"
            desc="Generate voucher WiFi sekolah, pembelian instan siswa & analitik pendapatan."
            badge="Modul 9"
            icon={Wifi}
            color="bg-teal-100 text-teal-700 group-hover:bg-teal-600"
          />
        </div>
      </div>
    </div>
  );
}

function ModuleCard({
  href,
  title,
  desc,
  badge,
  icon: Icon,
  color,
}: {
  href: string;
  title: string;
  desc: string;
  badge: string;
  icon: any;
  color: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div
              className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center group-hover:text-white transition-colors shadow-sm`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="default">{badge}</Badge>
          </div>
          <CardTitle className="text-base mt-2 group-hover:text-sky-600 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">{desc}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
