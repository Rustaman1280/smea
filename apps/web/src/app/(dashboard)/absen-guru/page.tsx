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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              2. Absen Guru & Log BKD
            </h1>
            <Badge variant="info">Modul 2</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Presensi kehadiran dewan guru, pencatatan beban kerja jam mengajar (BKD), dan pelaporan guru pengganti.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-foreground bg-card border border-border px-3.5 py-2 rounded-2xl shadow-sm">
          <Calendar className="h-4 w-4 text-indigo-500" />
          <span>Minggu, 16 Agustus 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Check-In / Check-Out Card */}
        <Card className="lg:col-span-4 border-indigo-500/20 bg-indigo-500/5">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30">
              <UserCheck2 className="h-7 w-7" />
            </div>
            <CardTitle className="mt-3 text-lg font-bold text-foreground">Presensi Kehadiran Guru</CardTitle>
            <CardDescription>
              {user.name} · NIP. 198501012010011001
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Presensi Masuk
                </span>
                <p className="text-sm font-bold text-foreground">{checkInTime}</p>
                <Badge variant="success" className="text-[9px]">Tepat Waktu</Badge>
              </div>

              <div className="p-3 rounded-2xl bg-card border border-border space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Presensi Pulang
                </span>
                <p className="text-sm font-bold text-foreground">
                  {checkOutTime || "Belum Pulang"}
                </p>
                <Badge variant={isCheckedOut ? "success" : "secondary"} className="text-[9px]">
                  {isCheckedOut ? "Selesai" : "Standby"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {!isCheckedOut ? (
                <Button
                  variant="gradient"
                  className="w-full font-bold min-h-[42px]"
                  onClick={handleCheckOut}
                >
                  <Clock className="h-4 w-4" />
                  Catat Jam Pulang Sekolah
                </Button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-300 text-xs text-center font-semibold">
                  ✓ Presensi harian Anda telah lengkap tercatat.
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-muted/40 border border-border p-3 text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Lokasi Terdeteksi:</span>
                <strong className="text-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-rose-500" />
                  SMKN 1 Garut (Radius 50m)
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Jam BKD Hari Ini:</span>
                <strong className="text-indigo-500 dark:text-indigo-300 font-bold">5 Jam Pelajaran</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teaching Logs / BKD */}
        <Card className="lg:col-span-8">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Log Jam Mengajar & BKD Hari Ini</CardTitle>
              <CardDescription>
                Beban Kerja Dosen / Guru (BKD) Terverifikasi Kurikulum
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Catat Sesi BKD
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-2xl border border-border bg-card/60 space-y-2 transition-all hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/25">
                        {s.className}
                      </span>
                      <h4 className="text-xs font-bold text-foreground">
                        {s.subjectName}
                      </h4>
                      {s.isSubstitute && (
                        <Badge variant="warning" className="text-[10px]">
                          Guru Pengganti
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Materi / Topik:</strong> {s.topic}
                    </p>
                  </div>
                  <Badge variant="success" className="text-[10px]">
                    {s.periods}
                  </Badge>
                </div>

                {s.substituteTeacherName && (
                  <p className="text-[11px] text-amber-500 dark:text-amber-300 italic">
                    ℹ️ {s.substituteTeacherName}
                  </p>
                )}

                <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="h-3.5 w-3.5" />
                    Kehadiran Siswa: {s.studentCount} Siswa
                  </span>
                  <span className="text-emerald-500 dark:text-emerald-300 font-semibold flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5" />
                    Tervalidasi BKD
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Add Teaching Session */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Catat Sesi Mengajar BKD"
        description="Laporkan materi yang diajarkan pada kelas hari ini."
        maxWidth="md"
      >
        <form onSubmit={handleAddSession} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas"
              value={classNameInput}
              onChange={(e) => setClassNameInput(e.target.value)}
              required
            />
            <Input
              label="Mata Pelajaran"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Alokasi Jam Pelajaran"
              value={periodInput}
              onChange={(e) => setPeriodInput(e.target.value)}
              required
            />
            <Input
              label="Jumlah Siswa Hadir"
              type="number"
              value={studentCountInput}
              onChange={(e) => setStudentCountInput(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Topik & Pokok Bahasan Materi
            </label>
            <textarea
              className="w-full rounded-2xl border border-input bg-card p-3.5 text-sm text-foreground min-h-[85px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tuliskan ringkasan materi atau modul praktikum yang telah diselesaikan..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isSubstituteInput}
              onChange={(e) => setIsSubstituteInput(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-400"
            />
            <span>Sesi ini menggantikan jam guru lain (Guru Pengganti)</span>
          </label>

          {isSubstituteInput && (
            <Input
              label="Nama Guru Asli yang Digantikan"
              placeholder="Contoh: Pak Hendrik, S.Pd"
              value={originalTeacherInput}
              onChange={(e) => setOriginalTeacherInput(e.target.value)}
              required
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="default" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
              Simpan Log BKD
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
