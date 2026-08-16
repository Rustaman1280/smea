"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, AttendanceStatus } from "@superapp/types";
import {
  QrCode,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Users,
  Camera,
  RefreshCw,
  Sparkles,
  Download,
  Filter,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StudentAttendanceItem {
  id: string;
  nisn: string;
  name: string;
  className: string;
  timeIn: string | null;
  status: AttendanceStatus;
  notes?: string;
}

const MOCK_CLASS_STUDENTS: StudentAttendanceItem[] = [
  { id: "stu-1", nisn: "0071234567", name: "Ahmad Fauzi", className: "XII RPL 1", timeIn: "07:05", status: AttendanceStatus.HADIR },
  { id: "stu-2", nisn: "0071234568", name: "Nabila Putri Azzahra", className: "XII RPL 1", timeIn: "07:10", status: AttendanceStatus.HADIR },
  { id: "stu-3", nisn: "0071234569", name: "Bima Pratama", className: "XII RPL 1", timeIn: "07:22", status: AttendanceStatus.TERLAMBAT, notes: "Macet di Tarogong" },
  { id: "stu-4", nisn: "0071234570", name: "Cantika Dewi", className: "XII RPL 1", timeIn: null, status: AttendanceStatus.SAKIT, notes: "Surat dokter terlampir" },
  { id: "stu-5", nisn: "0071234571", name: "Dimas Aditya", className: "XII RPL 1", timeIn: null, status: AttendanceStatus.IZIN, notes: "Acara keluarga" },
  { id: "stu-6", nisn: "0071234572", name: "Eko Prasetyo", className: "XII RPL 1", timeIn: null, status: AttendanceStatus.ALPHA },
  { id: "stu-7", nisn: "0071234573", name: "Fitri Handayani", className: "XII RPL 1", timeIn: "06:58", status: AttendanceStatus.HADIR },
  { id: "stu-8", nisn: "0071234574", name: "Gilang Ramadhan", className: "XII RPL 1", timeIn: "07:02", status: AttendanceStatus.HADIR },
];

export default function AbsensiSiswaPage() {
  const { user } = useAuthStore();
  const isStudent = user?.role === UserRole.SISWA;

  // Student states
  const [hasScanned, setHasScanned] = useState(true);
  const [scanSuccessMsg, setScanSuccessMsg] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Teacher / Staff states
  const [selectedClass, setSelectedClass] = useState("XII RPL 1");
  const [students, setStudents] = useState<StudentAttendanceItem[]>(MOCK_CLASS_STUDENTS);
  const [qrToken, setQrToken] = useState("SMK1-QR-20260816-LIVE-TOKEN-9A8B");

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setScanSuccessMsg("Presensi QR berhasil diverifikasi! Waktu masuk: 07:05 WIB (Tepat Waktu)");
    }, 1200);
  };

  const handleStatusChange = (studentId: string, newStatus: AttendanceStatus) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              status: newStatus,
              timeIn: newStatus === AttendanceStatus.HADIR ? "07:15" : s.timeIn,
            }
          : s
      )
    );
  };

  const stats = {
    total: students.length,
    hadir: students.filter((s) => s.status === AttendanceStatus.HADIR).length,
    terlambat: students.filter((s) => s.status === AttendanceStatus.TERLAMBAT).length,
    izin: students.filter((s) => s.status === AttendanceStatus.IZIN).length,
    sakit: students.filter((s) => s.status === AttendanceStatus.SAKIT).length,
    alpha: students.filter((s) => s.status === AttendanceStatus.ALPHA).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              1. Absensi Digital Siswa
            </h1>
            <Badge variant="default">Modul Inti</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Presensi QR Code dinamis harian & rekap kehadiran per kelas real-time.
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="XII RPL 1">Kelas XII RPL 1</option>
              <option value="XII RPL 2">Kelas XII RPL 2</option>
              <option value="XII TKJ 1">Kelas XII TKJ 1</option>
              <option value="X DKV 1">Kelas X DKV 1</option>
            </select>

            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
              Ekspor Rekap
            </Button>
          </div>
        )}
      </div>

      {/* SISWA VIEW */}
      {isStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* QR Scan Action Card */}
          <Card className="lg:col-span-5 border-sky-200 bg-gradient-to-b from-sky-50/50 to-white">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-200">
                <QrCode className="h-7 w-7" />
              </div>
              <CardTitle className="mt-3">Scan QR Absensi Masuk</CardTitle>
              <CardDescription>
                Arahkan kamera ke QR Code yang ditampilkan oleh guru / proyektor kelas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {scanSuccessMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{scanSuccessMsg}</span>
                </div>
              )}

              {/* QR Scanner Simulation Box */}
              <div className="relative aspect-square max-w-[260px] mx-auto rounded-2xl border-2 border-dashed border-sky-300 bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden p-4 text-center">
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-0.5 bg-sky-400 shadow-[0_0_12px_#38bdf8] animate-pulse" />
                <Camera className="h-10 w-10 text-sky-400 mb-2 opacity-80" />
                <p className="text-xs font-medium text-slate-300">
                  {isScanning ? "Memindai QR Code..." : "Kamera Scanner Siap"}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Token: {qrToken.substring(0, 16)}...
                </p>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                onClick={handleSimulateScan}
                isLoading={isScanning}
              >
                <Camera className="h-4 w-4" />
                Simulasikan Scan QR Presensi
              </Button>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500 flex items-center justify-between">
                <span>Batas Masuk Tepat Waktu:</span>
                <span className="font-bold text-slate-800">07:15 WIB</span>
              </div>
            </CardContent>
          </Card>

          {/* Student Attendance History */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Riwayat Kehadiran Saya</CardTitle>
                  <CardDescription>Bulan Agustus 2026 · Semester Ganjil</CardDescription>
                </div>
                <Badge variant="success">98% Kehadiran</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Jam Masuk</th>
                      <th className="pb-3">Metode</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Hari ini, 16 Ags</td>
                      <td className="py-3 font-semibold text-slate-800">07:05 WIB</td>
                      <td className="py-3">QR Code</td>
                      <td className="py-3">
                        <Badge variant="success">Hadir</Badge>
                      </td>
                      <td className="py-3 text-slate-400">Tepat waktu</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Jumat, 15 Ags</td>
                      <td className="py-3 font-semibold text-slate-800">07:02 WIB</td>
                      <td className="py-3">QR Code</td>
                      <td className="py-3">
                        <Badge variant="success">Hadir</Badge>
                      </td>
                      <td className="py-3 text-slate-400">-</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Kamis, 14 Ags</td>
                      <td className="py-3 font-semibold text-slate-800">07:22 WIB</td>
                      <td className="py-3">QR Code</td>
                      <td className="py-3">
                        <Badge variant="warning">Terlambat</Badge>
                      </td>
                      <td className="py-3 text-amber-700">Macet Tarogong</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-medium text-slate-900">Rabu, 13 Ags</td>
                      <td className="py-3 font-semibold text-slate-800">06:55 WIB</td>
                      <td className="py-3">QR Code</td>
                      <td className="py-3">
                        <Badge variant="success">Hadir</Badge>
                      </td>
                      <td className="py-3 text-slate-400">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* GURU / WALI KELAS / BK / STAFF VIEW */
        <div className="space-y-6">
          {/* Class Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-3 bg-white border-slate-200">
              <p className="text-[11px] font-semibold text-slate-500">Total Siswa</p>
              <h4 className="text-xl font-bold text-slate-900 mt-1">{stats.total}</h4>
            </Card>
            <Card className="p-3 bg-emerald-50/50 border-emerald-200">
              <p className="text-[11px] font-semibold text-emerald-700">Hadir</p>
              <h4 className="text-xl font-bold text-emerald-800 mt-1">{stats.hadir}</h4>
            </Card>
            <Card className="p-3 bg-amber-50/50 border-amber-200">
              <p className="text-[11px] font-semibold text-amber-700">Terlambat</p>
              <h4 className="text-xl font-bold text-amber-800 mt-1">{stats.terlambat}</h4>
            </Card>
            <Card className="p-3 bg-sky-50/50 border-sky-200">
              <p className="text-[11px] font-semibold text-sky-700">Izin</p>
              <h4 className="text-xl font-bold text-sky-800 mt-1">{stats.izin}</h4>
            </Card>
            <Card className="p-3 bg-indigo-50/50 border-indigo-200">
              <p className="text-[11px] font-semibold text-indigo-700">Sakit</p>
              <h4 className="text-xl font-bold text-indigo-800 mt-1">{stats.sakit}</h4>
            </Card>
            <Card className="p-3 bg-rose-50/50 border-rose-200">
              <p className="text-[11px] font-semibold text-rose-700">Alpha</p>
              <h4 className="text-xl font-bold text-rose-800 mt-1">{stats.alpha}</h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Projector / Class QR Display */}
            <Card className="lg:col-span-4 border-sky-200 bg-gradient-to-b from-sky-50/70 to-white">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-base">QR Presensi {selectedClass}</CardTitle>
                <CardDescription>
                  Tampilkan di layar proyektor kelas untuk di-scan oleh siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="p-4 bg-white rounded-2xl border border-sky-200 shadow-sm max-w-[200px] mx-auto">
                  <div className="aspect-square bg-slate-900 rounded-xl flex items-center justify-center p-3 text-white">
                    <QrCode className="h-28 w-28 text-sky-300" />
                  </div>
                </div>
                <div>
                  <Badge variant="default" className="text-xs">
                    Sesi Pagi · Berlaku hingga 12:00 WIB
                  </Badge>
                  <p className="text-[11px] font-mono text-slate-400 mt-2">
                    {qrToken}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrToken(`SMK1-QR-${Date.now()}`)}
                  className="w-full"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Generate Ulang Token QR
                </Button>
              </CardContent>
            </Card>

            {/* Class Student List & Manual Override */}
            <Card className="lg:col-span-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daftar Siswa {selectedClass}</CardTitle>
                    <CardDescription>
                      Presensi Hari Ini · Klik status untuk mengubah absensi manual
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                        <th className="pb-3">Siswa</th>
                        <th className="pb-3">Jam Masuk</th>
                        <th className="pb-3">Status Terkini</th>
                        <th className="pb-3 text-right">Ubah Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3">
                            <p className="font-bold text-slate-900">{s.name}</p>
                            <p className="text-[10px] text-slate-400">NISN: {s.nisn}</p>
                          </td>
                          <td className="py-3 font-semibold text-slate-800">
                            {s.timeIn ? `${s.timeIn} WIB` : "-"}
                          </td>
                          <td className="py-3">
                            <Badge
                              variant={
                                s.status === AttendanceStatus.HADIR
                                  ? "success"
                                  : s.status === AttendanceStatus.TERLAMBAT
                                  ? "warning"
                                  : s.status === AttendanceStatus.SAKIT
                                  ? "info"
                                  : s.status === AttendanceStatus.IZIN
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {s.status}
                            </Badge>
                            {s.notes && (
                              <p className="text-[10px] text-slate-400 mt-0.5">{s.notes}</p>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.HADIR)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.HADIR
                                    ? "bg-emerald-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                H
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.SAKIT)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.SAKIT
                                    ? "bg-indigo-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                S
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.IZIN)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.IZIN
                                    ? "bg-sky-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                I
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.ALPHA)}
                                className={`px-2 py-1 rounded text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.ALPHA
                                    ? "bg-rose-600 text-white"
                                    : "text-slate-600 hover:bg-slate-100"
                                }`}
                              >
                                A
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
