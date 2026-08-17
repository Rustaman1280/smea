"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, AttendanceStatus } from "@superapp/types";
import {
  QrCode,
  CheckCircle2,
  Clock,
  Camera,
  RefreshCw,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccessRestricted } from "@/components/ui/access-restricted";
import { Modal } from "@/components/ui/modal";

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

const ALLOWED_ROLES = [
  UserRole.SISWA,
  UserRole.GURU,
  UserRole.WALI_KELAS,
  UserRole.GURU_BK,
  UserRole.STAFF_TU,
  UserRole.ADMIN,
  UserRole.KEPSEK,
];

export default function AbsensiSiswaPage() {
  const { user } = useAuthStore();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <AccessRestricted
        moduleTitle="1. Absensi Digital Siswa"
        allowedRoles={ALLOWED_ROLES}
      />
    );
  }

  const isStudent = user.role === UserRole.SISWA;

  // Student states
  const [hasScanned, setHasScanned] = useState(true);
  const [scanSuccessMsg, setScanSuccessMsg] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  // Teacher / Staff states
  const [selectedClass, setSelectedClass] = useState("XII RPL 1");
  const [students, setStudents] = useState<StudentAttendanceItem[]>(MOCK_CLASS_STUDENTS);
  const [qrToken, setQrToken] = useState("SMK1-QR-20260816-LIVE-TOKEN-9A8B");
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setHasScanned(true);
      setScanSuccessMsg("Presensi QR berhasil diverifikasi! Waktu masuk: 07:05 WIB (Tepat Waktu - Area Sekolah)");
    }, 1000);
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              1. Absensi Digital Siswa
            </h1>
            <Badge variant="default">Modul 1</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Presensi QR Code dinamis harian, validasi geolokasi sekolah & rekapitulasi kehadiran per kelas.
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-xl border border-input bg-card px-3 py-2 text-xs font-semibold text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="XII RPL 1">Kelas XII RPL 1</option>
              <option value="XII RPL 2">Kelas XII RPL 2</option>
              <option value="XII TKJ 1">Kelas XII TKJ 1</option>
              <option value="X DKV 1">Kelas X DKV 1</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExportModalOpen(true)}
              className="font-semibold"
            >
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
          <Card className="lg:col-span-5 border-sky-500/20 bg-sky-500/5">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-500 dark:text-sky-400 border border-sky-500/30">
                <QrCode className="h-7 w-7" />
              </div>
              <CardTitle className="mt-3 text-lg font-bold text-foreground">Scan QR Presensi Siswa</CardTitle>
              <CardDescription>
                Arahkan kamera scanner ke layar proyektor kelas atau gerbang utama
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {scanSuccessMsg && (
                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/25 p-3 text-xs text-emerald-600 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{scanSuccessMsg}</span>
                </div>
              )}

              {/* QR Scanner Simulation Box */}
              <div className="relative aspect-square max-w-[260px] mx-auto rounded-3xl border-2 border-dashed border-sky-500/40 bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden p-4 text-center">
                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-0.5 bg-sky-400 shadow-[0_0_15px_#38bdf8] animate-pulse" />
                <Camera className="h-12 w-12 text-sky-400 mb-2 opacity-80" />
                <p className="text-xs font-bold text-slate-200">
                  {isScanning ? "Memverifikasi Kode Presensi..." : "Kamera Scanner Siap"}
                </p>
                <p className="text-[10px] text-sky-300 font-mono mt-1">
                  Token: {qrToken.substring(0, 16)}...
                </p>
              </div>

              <Button
                variant="gradient"
                className="w-full font-bold min-h-[42px]"
                onClick={handleSimulateScan}
                isLoading={isScanning}
                aria-label="Simulasikan Scan QR Presensi"
              >
                <Camera className="h-4 w-4" />
                Simulasikan Scan QR Presensi
              </Button>

              <div className="rounded-2xl bg-muted/40 border border-border p-3 text-xs text-muted-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="h-3.5 w-3.5 text-sky-500" />
                  Batas Masuk Tepat Waktu:
                </span>
                <span className="font-bold text-foreground">07:15 WIB</span>
              </div>
            </CardContent>
          </Card>

          {/* Student Attendance History */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Riwayat Kehadiran Siswa</CardTitle>
                  <CardDescription>Bulan Agustus 2026 · Ahmad Fauzi (XII RPL 1)</CardDescription>
                </div>
                <Badge variant="success">98% Kehadiran</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground uppercase font-semibold">
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Jam Masuk</th>
                      <th className="pb-3">Metode</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-foreground">
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Hari ini, 16 Ags</td>
                      <td className="py-3 font-medium text-foreground">07:05 WIB</td>
                      <td className="py-3 text-muted-foreground">QR Scanner</td>
                      <td className="py-3">
                        <Badge variant="success">Hadir</Badge>
                      </td>
                      <td className="py-3 text-emerald-500 dark:text-emerald-300 font-semibold">Tepat waktu</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Jumat, 15 Ags</td>
                      <td className="py-3 font-medium text-foreground">07:02 WIB</td>
                      <td className="py-3 text-muted-foreground">QR Scanner</td>
                      <td className="py-3">
                        <Badge variant="success">Hadir</Badge>
                      </td>
                      <td className="py-3 text-muted-foreground">-</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-foreground">Kamis, 14 Ags</td>
                      <td className="py-3 font-medium text-foreground">07:22 WIB</td>
                      <td className="py-3 text-muted-foreground">QR Scanner</td>
                      <td className="py-3">
                        <Badge variant="warning">Terlambat</Badge>
                      </td>
                      <td className="py-3 text-amber-500 dark:text-amber-300 font-medium">Macet Tarogong</td>
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
            <Card className="p-3">
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Total Siswa</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.total}</h4>
            </Card>
            <Card className="p-3 border-emerald-500/20 bg-emerald-500/5">
              <p className="text-[11px] font-medium text-emerald-500 dark:text-emerald-300 uppercase tracking-wider">Hadir</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.hadir}</h4>
            </Card>
            <Card className="p-3 border-amber-500/20 bg-amber-500/5">
              <p className="text-[11px] font-medium text-amber-500 dark:text-amber-300 uppercase tracking-wider">Terlambat</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.terlambat}</h4>
            </Card>
            <Card className="p-3 border-sky-500/20 bg-sky-500/5">
              <p className="text-[11px] font-medium text-sky-500 dark:text-sky-300 uppercase tracking-wider">Izin</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.izin}</h4>
            </Card>
            <Card className="p-3 border-indigo-500/20 bg-indigo-500/5">
              <p className="text-[11px] font-medium text-indigo-500 dark:text-indigo-300 uppercase tracking-wider">Sakit</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.sakit}</h4>
            </Card>
            <Card className="p-3 border-rose-500/20 bg-rose-500/5">
              <p className="text-[11px] font-medium text-rose-500 dark:text-rose-300 uppercase tracking-wider">Alpha</p>
              <h4 className="text-xl font-bold text-foreground mt-1">{stats.alpha}</h4>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Projector / Class QR Display */}
            <Card className="lg:col-span-4 border-sky-500/20 bg-sky-500/5">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-base">QR Presensi {selectedClass}</CardTitle>
                <CardDescription>
                  Tampilkan di layar proyektor kelas untuk di-scan oleh siswa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="p-4 bg-white dark:bg-card rounded-3xl border border-sky-500/25 shadow-md max-w-[200px] mx-auto">
                  <div className="aspect-square bg-slate-950 rounded-2xl flex items-center justify-center p-3 text-white">
                    <QrCode className="h-28 w-28 text-sky-300" />
                  </div>
                </div>
                <div>
                  <Badge variant="default" className="text-xs">
                    Sesi Pagi · Berlaku s.d 12:00 WIB
                  </Badge>
                  <p className="text-[10px] font-mono text-muted-foreground mt-2">
                    {qrToken}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrToken(`SMK1-QR-${Date.now()}`)}
                  className="w-full font-semibold"
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
                      <tr className="border-b border-border text-muted-foreground uppercase font-semibold">
                        <th className="pb-3">Siswa</th>
                        <th className="pb-3">Jam Masuk</th>
                        <th className="pb-3">Status Terkini</th>
                        <th className="pb-3 text-right">Ubah Status Cepat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-foreground">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3">
                            <p className="font-semibold text-foreground">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground">NISN: {s.nisn}</p>
                          </td>
                          <td className="py-3 font-medium text-foreground">
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
                              <p className="text-[10px] text-muted-foreground mt-0.5">{s.notes}</p>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="inline-flex rounded-xl border border-border bg-card p-0.5 shadow-sm">
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.HADIR)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.HADIR
                                    ? "bg-emerald-600 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                                title="Set Hadir"
                                aria-label={`Set ${s.name} Hadir`}
                              >
                                H
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.SAKIT)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.SAKIT
                                    ? "bg-indigo-600 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                                title="Set Sakit"
                                aria-label={`Set ${s.name} Sakit`}
                              >
                                S
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.IZIN)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.IZIN
                                    ? "bg-sky-600 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                                title="Set Izin"
                                aria-label={`Set ${s.name} Izin`}
                              >
                                I
                              </button>
                              <button
                                onClick={() => handleStatusChange(s.id, AttendanceStatus.ALPHA)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  s.status === AttendanceStatus.ALPHA
                                    ? "bg-rose-600 text-white"
                                    : "text-muted-foreground hover:bg-muted"
                                }`}
                                title="Set Alpha"
                                aria-label={`Set ${s.name} Alpha`}
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

      {/* Modal Export Rekap */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Ekspor Rekap Kehadiran Siswa"
        description="Unduh berkas rekap presensi kelas format Excel / PDF untuk laporan bulanan."
        maxWidth="md"
      >
        <div className="space-y-4 mt-2">
          <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 space-y-1 text-xs">
            <p className="font-bold text-foreground">Kelas: {selectedClass}</p>
            <p className="text-muted-foreground">Periode: 1 s.d 16 Agustus 2026</p>
            <p className="text-emerald-500 dark:text-emerald-300 font-semibold">Tingkat Kehadiran: 94.8%</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsExportModalOpen(false)}>
              Batal
            </Button>
            <Button
              variant="gradient"
              onClick={() => {
                setIsExportModalOpen(false);
                alert("Rekap kehadiran berhasil diekspor!");
              }}
            >
              <FileSpreadsheet className="h-4 w-4" />
              Unduh File Spreadsheet
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
