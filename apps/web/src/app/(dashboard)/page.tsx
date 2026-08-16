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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user } = useAuthStore();

  if (!user) return null;

  const demoInfo = DEMO_ACCOUNTS[user.role];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-800 p-6 sm:p-8 text-white shadow-xl shadow-sky-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-sky-200" />
              <span>Selamat Datang di Superapp SMKN 1 Garut</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Halo, {user.name} 👋
            </h1>
            <p className="text-sm text-sky-100 max-w-xl">
              Peran Anda saat ini adalah{" "}
              <strong className="text-white font-bold">{demoInfo?.title || user.role}</strong>{" "}
              — {demoInfo?.subtitle}. Semua data dan akses di bawah telah disesuaikan secara otomatis.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/absensi-siswa">
              <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                <QrCode className="h-4 w-4" />
                Absen QR
              </Button>
            </Link>
            <Link href="/mata-pelajaran">
              <Button variant="default" className="bg-white text-sky-800 hover:bg-sky-50 shadow-none font-bold">
                Lihat Jadwal & Mapel
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-indigo-500/30 blur-2xl" />
        <div className="absolute right-40 -top-10 h-36 w-36 rounded-full bg-sky-400/20 blur-xl" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-sky-100 bg-sky-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-sky-800">Status Kehadiran</p>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Hadir (07:05)</h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Tepat Waktu</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-sky-600 text-white flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-800">Mata Pelajaran Hari Ini</p>
              <h4 className="text-lg font-bold text-slate-900 mt-1">3 Sesi Mapel</h4>
              <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Lab RPL 2</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-100 bg-amber-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-800">Proyek & Tugas Aktif</p>
              <h4 className="text-lg font-bold text-slate-900 mt-1">2 Deadline</h4>
              <p className="text-[11px] text-amber-700 font-semibold mt-0.5">POS Kantin RPL</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-600 text-white flex items-center justify-center">
              <KanbanSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-emerald-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-800">Voucher & Hotspot</p>
              <h4 className="text-lg font-bold text-slate-900 mt-1">Aktif (10 Mbps)</h4>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Sisa 18 Jam</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <Wifi className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 9 Core Modules Directory Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            9 Modul Inti Superapp SMKN 1 Garut
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Terintegrasi Single Sign-On (SSO)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Absensi Siswa */}
          <Link href="/absensi-siswa">
            <Card className="h-full hover:border-sky-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <QrCode className="h-5 w-5" />
                  </div>
                  <Badge variant="default">Modul 1</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-sky-600 transition-colors">
                  1. Absensi Digital Siswa
                </CardTitle>
                <CardDescription>
                  Presensi QR Code harian dinamis, rekap kelas real-time & status per jam pelajaran.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 2. Absen Guru */}
          <Link href="/absen-guru">
            <Card className="h-full hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="info">Modul 2</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-indigo-600 transition-colors">
                  2. Absen Guru & Log BKD
                </CardTitle>
                <CardDescription>
                  Check-in guru masuk/pulang, log jam mengajar per kelas & laporan kinerja dinas.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 3. BK & Pelanggaran */}
          <Link href="/bk-pelanggaran">
            <Card className="h-full hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <Badge variant="destructive">Modul 3</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-rose-600 transition-colors">
                  3. BK & Pelanggaran
                </CardTitle>
                <CardDescription>
                  Poin pelanggaran, rekam sesi konseling & cetak otomatis Surat Panggilan Orang Tua.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 4. Showcase Kantin */}
          <Link href="/kantin">
            <Card className="h-full hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>
                  <Badge variant="warning">Modul 4</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-amber-600 transition-colors">
                  4. Showcase Kantin
                </CardTitle>
                <CardDescription>
                  Katalog menu digital per stand kantin & update status stok habis secara real-time.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 5. Ekstrakurikuler */}
          <Link href="/ekskul">
            <Card className="h-full hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <Badge variant="success">Modul 5</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-emerald-600 transition-colors">
                  5. Ekstrakurikuler
                </CardTitle>
                <CardDescription>
                  Pendaftaran ekskul online, jadwal latihan, absensi anggota & rekam piagam prestasi.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 6. Mata Pelajaran */}
          <Link href="/mata-pelajaran">
            <Card className="h-full hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                    <BookOpenCheck className="h-5 w-5" />
                  </div>
                  <Badge variant="default">Modul 6</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-cyan-600 transition-colors">
                  6. Mapel & Mini LMS
                </CardTitle>
                <CardDescription>
                  Materi pelajaran digital (PDF/video), tugas terstruktur & penilaian otomatis guru.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 7. Project Tracker */}
          <Link href="/project-tracker">
            <Card className="h-full hover:border-purple-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <KanbanSquare className="h-5 w-5" />
                  </div>
                  <Badge variant="secondary">Modul 7</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-purple-600 transition-colors">
                  7. Project & Jurnal PKL
                </CardTitle>
                <CardDescription>
                  Board Kanban proyek produktif SMK, repository GitHub demo & jurnal harian PKL/Prakerin.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 8. Inventaris */}
          <Link href="/inventaris">
            <Card className="h-full hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <Badge variant="warning">Modul 8</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-orange-600 transition-colors">
                  8. Inventaris Sarpras
                </CardTitle>
                <CardDescription>
                  Katalog aset lab & alat praktik, pengajuan peminjaman (checkout) & log maintenance.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* 9. ISP Voucher */}
          <Link href="/isp-voucher">
            <Card className="h-full hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <Wifi className="h-5 w-5" />
                  </div>
                  <Badge variant="success">Modul 9</Badge>
                </div>
                <CardTitle className="text-base mt-2 group-hover:text-teal-600 transition-colors">
                  9. ISP Jual Voucher Hotspot
                </CardTitle>
                <CardDescription>
                  Generate voucher WiFi sekolah, pembelian instan siswa & analitik pendapatan operator.
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
