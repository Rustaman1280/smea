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
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface TeachingSession {
  id: string;
  className: string;
  subjectName: string;
  periods: string;
  topic: string;
  studentCount: number;
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
];

export default function AbsenGuruPage() {
  const { user } = useAuthStore();
  const isKepsekOrAdmin = user?.role === UserRole.KEPSEK || user?.role === UserRole.ADMIN;

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState("06:48 WIB");
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);

  // Teaching sessions state
  const [sessions, setSessions] = useState<TeachingSession[]>(INITIAL_SESSIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classNameInput, setClassNameInput] = useState("XII RPL 2");
  const [subjectInput, setSubjectInput] = useState("Basis Data & Cloud");
  const [periodInput, setPeriodInput] = useState("Jam ke-4 s.d 6 (09:45 - 12:00)");
  const [topicInput, setTopicInput] = useState("");
  const [studentCountInput, setStudentCountInput] = useState("32");

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
    };

    setSessions([...sessions, newSession]);
    setTopicInput("");
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
            Presensi kehadiran guru terpisah & pencatatan log mengajar harian (Beban Kerja Guru).
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
          <Calendar className="h-4 w-4 text-indigo-600" />
          <span>Minggu, 16 Agustus 2026</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Guru Self Service Checkin Card */}
        <Card className="lg:col-span-5 border-indigo-100 bg-gradient-to-b from-indigo-50/50 to-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Status Presensi Masuk / Pulang</CardTitle>
              <Badge variant={isCheckedIn ? "success" : "secondary"}>
                {isCheckedIn ? "Sudah Masuk" : "Belum Absen"}
              </Badge>
            </div>
            <CardDescription>
              {user?.name} · {user?.role}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Geolocation Verification Box */}
            <div className="rounded-xl border border-indigo-200/80 bg-white p-3.5 space-y-2 text-xs shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  Lokasi Presensi:
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Terverifikasi di Area Sekolah
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                SMKN 1 Garut, Jl. Cimanuk No.309A, Tarogong Kidul, Garut
              </p>
            </div>

            {/* Checkin / Checkout Timing */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-semibold uppercase text-slate-400">Jam Masuk</p>
                <p className="text-base font-bold text-slate-900 mt-1">{checkInTime}</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Tepat Waktu</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[10px] font-semibold uppercase text-slate-400">Jam Pulang</p>
                <p className="text-base font-bold text-slate-900 mt-1">
                  {checkOutTime || "Belum Check-out"}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Min. 15:30 WIB</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant={isCheckedIn ? "outline" : "gradient"}
                className="flex-1"
                disabled={isCheckedIn}
                onClick={handleCheckIn}
              >
                <CheckCircle2 className="h-4 w-4" />
                Check-in Masuk
              </Button>
              <Button
                variant={isCheckedOut ? "outline" : "default"}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
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
              <CardTitle>Log Beban Kerja Mengajar (BKD)</CardTitle>
              <CardDescription>
                Catatan kelas, jam pelajaran, dan materi yang telah diajarkan hari ini
              </CardDescription>
            </div>
            <Button
              variant="default"
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700"
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
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 transition-all space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {session.className}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-indigo-700">
                          {session.subjectName}
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {session.periods}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Materi:</strong> {session.topic}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Kehadiran Siswa di Kelas: {session.studentCount} Siswa</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
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

      {/* Overview for Kepsek & Admin */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rekap Kehadiran Guru SMKN 1 Garut (Hari Ini)</CardTitle>
              <CardDescription>
                Pantauan real-time kehadiran seluruh dewan guru & total jam mengajar
              </CardDescription>
            </div>
            <Badge variant="info">Total: 48 Guru Aktif</Badge>
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
                  <th className="pb-3">Check-Out</th>
                  <th className="pb-3">Total Jam BKD</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">Budi Santoso, S.Kom</td>
                  <td className="py-3 text-slate-500">19850101... · RPL</td>
                  <td className="py-3 font-semibold text-slate-800">06:48 WIB</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 font-bold text-indigo-700">3 Jam Pelajaran</td>
                  <td className="py-3">
                    <Badge variant="success">Hadir</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">Dedi Supriadi, M.T</td>
                  <td className="py-3 text-slate-500">19820720... · RPL</td>
                  <td className="py-3 font-semibold text-slate-800">06:55 WIB</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 font-bold text-indigo-700">4 Jam Pelajaran</td>
                  <td className="py-3">
                    <Badge variant="success">Hadir</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3 font-bold text-slate-900">Siti Rahmawati, S.Pd</td>
                  <td className="py-3 text-slate-500">19870315... · BK</td>
                  <td className="py-3 font-semibold text-slate-800">07:02 WIB</td>
                  <td className="py-3 text-slate-400">-</td>
                  <td className="py-3 font-bold text-indigo-700">2 Sesi Konseling</td>
                  <td className="py-3">
                    <Badge variant="success">Hadir</Badge>
                  </td>
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
        description="Masukkan data sesi kelas dan materi pelajaran yang telah disampaikan."
        maxWidth="lg"
      >
        <form onSubmit={handleAddSession} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Kelas"
              value={classNameInput}
              onChange={(e) => setClassNameInput(e.target.value)}
              placeholder="XII RPL 1"
              required
            />
            <Input
              label="Mata Pelajaran"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Pemrograman Web"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Alokasi Jam Pelajaran"
              value={periodInput}
              onChange={(e) => setPeriodInput(e.target.value)}
              placeholder="Jam ke-1 s.d 3"
              required
            />
            <Input
              label="Jumlah Siswa Hadir"
              type="number"
              value={studentCountInput}
              onChange={(e) => setStudentCountInput(e.target.value)}
              placeholder="34"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Topik & Pokok Bahasan Materi
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 min-h-[90px]"
              placeholder="Jelaskan ringkasan materi dan kegiatan praktik..."
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              required
            />
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
              Simpan Log Sesi Mengajar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
