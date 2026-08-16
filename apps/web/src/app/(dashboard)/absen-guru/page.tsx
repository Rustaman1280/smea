"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  UserCheck2,
  Clock,
  MapPin,
  BookOpen,
  Plus,
  CheckCircle2,
  Calendar,
  Building,
  FileCheck,
  Check,
  AlertCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AccessRestricted } from "@/components/ui/access-restricted";

interface TeachingSession {
  id: string;
  className: string;
  subjectName: string;
  periods: string;
  topic: string;
  studentCount: number;
  isSubstitute?: boolean;
  substituteTeacherName?: string;
}

const INITIAL_SESSIONS: TeachingSession[] = [
  {
    id: "s-1",
    className: "XII RPL 1",
    subjectName: "Pemrograman Web & Mobile",
    periods: "Jam ke-1 s.d 3 (07:15 - 09:30)",
    topic: "Integrasi REST API NestJS dengan Next.js App Router",
    studentCount: 34,
  },
  {
    id: "s-2",
    className: "XI TKJ 2",
    subjectName: "Administrasi Sistem Jaringan",
    periods: "Jam ke-4 s.d 5 (09:45 - 11:15)",
    topic: "Konfigurasi MikroTik Hotspot RADIUS (Guru Pengganti)",
    studentCount: 30,
    isSubstitute: true,
    substituteTeacherName: "Budi Santoso, S.Kom (Menggantikan Pak Hendrik)",
  },
];

const ALLOWED_ROLES = [
  UserRole.GURU,
  UserRole.GURU_BK,
  UserRole.WALI_KELAS,
  UserRole.PEMBINA_EKSKUL,
  UserRole.STAFF_TU,
  UserRole.ADMIN,
  UserRole.KEPSEK,
];

export default function AbsenGuruPage() {
  const { user } = useAuthStore();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <AccessRestricted
        moduleTitle="2. Absen Guru & Log BKD"
        allowedRoles={ALLOWED_ROLES}
      />
    );
  }

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState("06:48 WIB");
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  // Teaching sessions state
  const [sessions, setSessions] = useState<TeachingSession[]>(INITIAL_SESSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classNameInput, setClassNameInput] = useState("XII RPL 2");
  const [subjectInput, setSubjectInput] = useState("Basis Data & Cloud");
  const [periodInput, setPeriodInput] = useState("Jam ke-6 s.d 8 (12:30 - 14:45)");
  const [topicInput, setTopicInput] = useState("");
  const [studentCountInput, setStudentCountInput] = useState("32");
  const [isSubstituteInput, setIsSubstituteInput] = useState(false);
  const [originalTeacherInput, setOriginalTeacherInput] = useState("");

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB");
  };

  const handleCheckOut = () => {
    setIsCheckedOut(true);
    setCheckOutTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB");
  };

  const handleAddSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput) return;

    const newSession: TeachingSession = {
      id: `s-${Date.now()}`,
      className: classNameInput,
      subjectName: subjectInput,
      periods: periodInput,
      topic: topicInput,
      studentCount: parseInt(studentCountInput) || 30,
      isSubstitute: isSubstituteInput,
      substituteTeacherName: isSubstituteInput
        ? `${user.name} (Menggantikan ${originalTeacherInput || "Guru Berhalangan"})`
        : undefined,
    };

    setSessions([...sessions, newSession]);
    setTopicInput("");
    setIsSubstituteInput(false);
    setOriginalTeacherInput("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              2. Absen Guru & Log BKD
            </h1>
            <Badge variant="info">Modul 2</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Presensi kehadiran dewan guru, pencatatan beban kerja jam mengajar (BKD), dan pelaporan guru pengganti.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3.5 py-2 rounded-2xl shadow-sm">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>Minggu, 16 Agustus 2026</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guru Self Service Checkin Card */}
        <Card className="lg:col-span-5 border-indigo-200/80 bg-gradient-to-b from-indigo-50/50 to-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Status Presensi Guru</CardTitle>
              <Badge variant={isCheckedIn ? "success" : "secondary"}>
                {isCheckedIn ? "Sudah Hadir" : "Belum Absen"}
              </Badge>
            </div>
            <CardDescription>
              {user.name} · {user.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Geolocation Verification Box */}
            <div className="rounded-2xl border border-indigo-200 bg-white p-3.5 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 flex items-center gap-1.5 font-bold">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  Radius Geolokasi Presensi:
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                  Terverifikasi di Sekolah
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                SMKN 1 Garut (Radius 50m dari Titik Koordinat Utama)
              </p>
            </div>

            {/* Checkin / Checkout Timing */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jam Masuk</p>
                <p className="text-base font-black text-slate-900 mt-1">{checkInTime}</p>
                <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Tepat Waktu</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Jam Pulang</p>
                <p className="text-base font-black text-slate-900 mt-1">
                  {checkOutTime || "Belum Check-out"}
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">Min. 15:30 WIB</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isCheckedIn ? "outline" : "gradient"}
                className="flex-1 font-bold"
                disabled={isCheckedIn}
                onClick={handleCheckIn}
              >
                <CheckCircle2 className="h-4 w-4" />
                Check-in Masuk
              </Button>
              <Button
                variant={isCheckedOut ? "outline" : "default"}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold"
                disabled={!isCheckedIn || isCheckedOut}
                onClick={handleCheckOut}
              >
                <Clock className="h-4 w-4" />
                Check-out Pulang
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Hours / BKD Logger */}
        <Card className="lg:col-span-7">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Log Jam Mengajar Hari Ini (BKD)</CardTitle>
              <CardDescription>
                Pencatatan kelas, materi, dan jam mengajar guru (termasuk guru pengganti)
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 font-bold"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Catat Jam Mengajar
            </Button>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Belum ada sesi jam mengajar yang dicatat hari ini.
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {session.className}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold text-indigo-800">
                          {session.subjectName}
                        </span>
                        {session.isSubstitute && (
                          <Badge variant="warning" className="text-[10px]">
                            Guru Pengganti
                          </Badge>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {session.periods}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Pokok Bahasan:</strong> {session.topic}
                    </p>

                    {session.substituteTeacherName && (
                      <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200 font-semibold">
                        Catatan Pengganti: {session.substituteTeacherName}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span>Kehadiran Siswa: {session.studentCount} Orang</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Tervalidasi BKD
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Schoolwide Recap Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rekapitulasi Kehadiran Dewan Guru SMKN 1 Garut</CardTitle>
              <CardDescription>
                Pantauan harian kehadiran seluruh bapak/ibu guru pengampu
              </CardDescription>
            </div>
            <Badge variant="info">48 Dewan Guru Aktif</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Nama Guru</th>
                  <th className="pb-3">NIP / Bidang</th>
                  <th className="pb-3">Check-In</th>
                  <th className="pb-3">Total Jam BKD</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">Budi Santoso, S.Kom</td>
                  <td className="py-3 text-slate-500">19850101... · RPL</td>
                  <td className="py-3 font-semibold text-slate-800">06:48 WIB</td>
                  <td className="py-3 font-bold text-indigo-700">5 Jam Pelajaran</td>
                  <td className="py-3">
                    <Badge variant="success">Hadir</Badge>
                  </td>
                  <td className="py-3 text-right text-slate-400">-</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">Hendrik Kurniawan, S.Pd</td>
                  <td className="py-3 text-slate-500">19880412... · TKJ</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 font-bold text-slate-500">0 Jam</td>
                  <td className="py-3">
                    <Badge variant="warning">Izin Dinas</Badge>
                  </td>
                  <td className="py-3 text-right text-amber-700 font-semibold">Digantikan Budi Santoso</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Add Teaching Session */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Jam Mengajar (Log BKD)"
        description="Rekam sesi kelas, pokok bahasan, dan flag jika Anda menjadi guru pengganti."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSession} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas"
              value={classNameInput}
              onChange={(e) => setClassNameInput(e.target.value)}
              placeholder="XII RPL 2"
              required
            />
            <Input
              label="Mata Pelajaran"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Basis Data"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Alokasi Jam Pelajaran"
              value={periodInput}
              onChange={(e) => setPeriodInput(e.target.value)}
              placeholder="Jam ke-6 s.d 8"
              required
            />
            <Input
              label="Jumlah Siswa Hadir"
              type="number"
              value={studentCountInput}
              onChange={(e) => setStudentCountInput(e.target.value)}
              placeholder="32"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Topik & Pokok Bahasan Praktik
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 min-h-[85px]"
              placeholder="Jelaskan ringkasan materi dan kegiatan praktikum..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              required
            />
          </div>

          {/* Substitute Teacher Flag */}
          <div className="rounded-2xl border border-slate-200 p-3 bg-slate-50 space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isSubstituteInput}
                onChange={(e) => setIsSubstituteInput(e.target.checked)}
                className="rounded text-sky-600 focus:ring-sky-400"
              />
              <span>Tandai sebagai Guru Pengganti (Invalen)</span>
            </label>

            {isSubstituteInput && (
              <Input
                label="Nama Guru Asli yang Digantikan"
                value={originalTeacherInput}
                onChange={(e) => setOriginalTeacherInput(e.target.value)}
                placeholder="Contoh: Hendrik Kurniawan, S.Pd (Dinas Luar)"
                required
              />
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Simpan Log Sesi BKD
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
