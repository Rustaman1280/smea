"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, ViolationSeverity } from "@superapp/types";
import {
  ShieldAlert,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Plus,
  Printer,
  Sparkles,
  CheckCircle2,
  Lock,
  MessageSquareText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface CaseItem {
  id: string;
  studentName: string;
  nisn: string;
  className: string;
  category: ViolationSeverity;
  title: string;
  description: string;
  points: number;
  reporterName: string;
  date: string;
  status: "DIPROSES" | "SELESAI" | "PANGGILAN_ORANG_TUA";
}

const INITIAL_CASES: CaseItem[] = [
  {
    id: "case-1",
    studentName: "Ahmad Fauzi",
    nisn: "0071234567",
    className: "XII RPL 1",
    category: ViolationSeverity.RINGAN,
    title: "Terlambat Masuk Sekolah 3x",
    description: "Siswa terlambat masuk sekolah lebih dari 3 kali dalam kurun 1 bulan.",
    points: 10,
    reporterName: "Dedi Supriadi, M.T (Wali Kelas)",
    date: "14 Agustus 2026",
    status: "DIPROSES",
  },
  {
    id: "case-2",
    studentName: "Bima Pratama",
    nisn: "0071234569",
    className: "XII RPL 1",
    category: ViolationSeverity.SEDANG,
    title: "Meninggalkan Kelas Tanpa Izin (Bolos)",
    description: "Tidak berada di kelas saat mata pelajaran produktif berlangsung di jam ke 5-6.",
    points: 25,
    reporterName: "Budi Santoso, S.Kom (Guru Mapel)",
    date: "12 Agustus 2026",
    status: "PANGGILAN_ORANG_TUA",
  },
];

export default function BkPelanggaranPage() {
  const { user } = useAuthStore();
  const isStudent = user?.role === UserRole.SISWA;

  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isCounselingModalOpen, setIsCounselingModalOpen] = useState(false);
  const [selectedLetterCase, setSelectedLetterCase] = useState<CaseItem | null>(null);

  // Form states
  const [studentNameInput, setStudentNameInput] = useState("Ahmad Fauzi");
  const [classInput, setClassInput] = useState("XII RPL 1");
  const [categoryInput, setCategoryInput] = useState<ViolationSeverity>(ViolationSeverity.RINGAN);
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [pointsInput, setPointsInput] = useState(10);
  const [needsSummons, setNeedsSummons] = useState(false);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput) return;

    const newCase: CaseItem = {
      id: `case-${Date.now()}`,
      studentName: studentNameInput,
      nisn: "0071234567",
      className: classInput,
      category: categoryInput,
      title: titleInput,
      description: descInput,
      points: Number(pointsInput),
      reporterName: `${user?.name || "Guru BK"} (${user?.role || "BK"})`,
      date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      status: needsSummons ? "PANGGILAN_ORANG_TUA" : "DIPROSES",
    };

    setCases([newCase, ...cases]);
    setIsCaseModalOpen(false);
    setTitleInput("");
    setDescInput("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              3. BK & Pelanggaran
            </h1>
            <Badge variant="destructive">Data Sensitif Terbatas</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manajemen poin kedisiplinan, sesi bimbingan konseling, dan surat panggilan orang tua.
          </p>
        </div>

        {!isStudent && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCounselingModalOpen(true)}
            >
              <MessageSquareText className="h-4 w-4" />
              Sesi Konseling
            </Button>
            <Button
              variant="default"
              size="sm"
              className="bg-rose-600 hover:bg-rose-700 shadow-rose-100"
              onClick={() => setIsCaseModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Input Kasus Pelanggaran
            </Button>
          </div>
        )}
      </div>

      {/* SISWA VIEW */}
      {isStudent ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student Points Meter */}
          <Card className="lg:col-span-4 border-rose-100 bg-gradient-to-b from-rose-50/40 to-white">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-200">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <CardTitle className="mt-3">Status Poin Pelanggaran</CardTitle>
              <CardDescription>
                Batas maksimal akumulasi: 100 Poin (Pemberhentian / SP3)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="py-4">
                <div className="text-4xl font-extrabold text-slate-900">
                  10 <span className="text-lg font-medium text-slate-400">/ 100 Poin</span>
                </div>
                <div className="mt-3 w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: "10%" }}
                  />
                </div>
                <div className="mt-2">
                  <Badge variant="success" className="text-xs">
                    Status: Sangat Baik (Aman)
                  </Badge>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-xs text-left text-slate-600 space-y-1.5 border border-slate-100">
                <p className="font-semibold text-slate-800">Ketentuan Poin Sanksi:</p>
                <p>• 25 Poin: Peringatan Lisan & Konseling BK</p>
                <p>• 50 Poin: Surat Peringatan 1 & Panggilan Orang Tua</p>
                <p>• 75 Poin: Surat Peringatan 2 & Skorsing</p>
                <p>• 100 Poin: Dikembalikan ke Orang Tua</p>
              </div>
            </CardContent>
          </Card>

          {/* Student Case History */}
          <Card className="lg:col-span-8">
            <CardHeader>
              <CardTitle>Riwayat Pelanggaran & Catatan Konseling</CardTitle>
              <CardDescription>
                Hanya dapat diakses oleh Anda, Wali Kelas, Guru BK, dan Kepala Sekolah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning">Pelanggaran Ringan (+10 Poin)</Badge>
                      <span className="text-xs font-bold text-slate-800">
                        Terlambat Masuk Sekolah 3x
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">14 Agustus 2026</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Siswa tiba di sekolah lewat dari pukul 07:15 WIB pada hari Senin, Selasa, dan Kamis.
                  </p>
                  <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Pelapor: Dedi Supriadi, M.T (Wali Kelas)</span>
                    <Badge variant="info">Sudah Konseling BK</Badge>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">
                      Sesi Bimbingan Konseling (BK)
                    </span>
                    <span className="text-xs text-slate-400">15 Agustus 2026</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Catatan Konselor:</strong> Diberikan pengarahan mengenai manajemen waktu tidur malam dan komitmen kehadiran tepat waktu sebelum bel berbunyi.
                  </p>
                  <p className="text-[11px] text-indigo-700 font-semibold">
                    Konselor: Siti Rahmawati, S.Pd (Guru BK)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* GURU BK & WALI KELAS VIEW */
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-4 bg-white border-slate-200">
              <p className="text-xs font-semibold text-slate-500">Total Kasus Aktif</p>
              <h4 className="text-2xl font-bold text-slate-900 mt-1">{cases.length}</h4>
            </Card>
            <Card className="p-4 bg-amber-50/50 border-amber-200">
              <p className="text-xs font-semibold text-amber-700">Pelanggaran Ringan</p>
              <h4 className="text-2xl font-bold text-amber-800 mt-1">
                {cases.filter((c) => c.category === ViolationSeverity.RINGAN).length}
              </h4>
            </Card>
            <Card className="p-4 bg-rose-50/50 border-rose-200">
              <p className="text-xs font-semibold text-rose-700">Sedang / Berat</p>
              <h4 className="text-2xl font-bold text-rose-800 mt-1">
                {cases.filter((c) => c.category !== ViolationSeverity.RINGAN).length}
              </h4>
            </Card>
            <Card className="p-4 bg-purple-50/50 border-purple-200">
              <p className="text-xs font-semibold text-purple-700">Perlu Panggilan Ortu</p>
              <h4 className="text-2xl font-bold text-purple-800 mt-1">
                {cases.filter((c) => c.status === "PANGGILAN_ORANG_TUA").length}
              </h4>
            </Card>
          </div>

          {/* Cases List */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kasus Kedisiplinan & BK</CardTitle>
              <CardDescription>
                Data terbatas: Hanya dapat dilihat oleh Guru BK, Wali Kelas, dan Kepala Sekolah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                      <th className="pb-3">Siswa / Kelas</th>
                      <th className="pb-3">Pelanggaran</th>
                      <th className="pb-3">Kategori</th>
                      <th className="pb-3">Poin</th>
                      <th className="pb-3">Pelapor</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {cases.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3">
                          <p className="font-bold text-slate-900">{c.studentName}</p>
                          <p className="text-[10px] text-slate-400">{c.className} · {c.nisn}</p>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-slate-800">{c.title}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1">{c.description}</p>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant={
                              c.category === ViolationSeverity.RINGAN
                                ? "warning"
                                : c.category === ViolationSeverity.SEDANG
                                ? "destructive"
                                : "destructive"
                            }
                          >
                            {c.category}
                          </Badge>
                        </td>
                        <td className="py-3 font-bold text-rose-600">+{c.points}</td>
                        <td className="py-3 text-slate-500">{c.reporterName}</td>
                        <td className="py-3 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedLetterCase(c)}
                              title="Cetak Surat Panggilan"
                            >
                              <Printer className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Surat Ortu</span>
                            </Button>
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
      )}

      {/* Modal Input Kasus Pelanggaran */}
      <Modal
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
        title="Input Kasus Pelanggaran Siswa"
        description="Catat tindakan indisipliner siswa dan tentukan bobot poin sesuai tata tertib sekolah."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nama Siswa"
              value={studentNameInput}
              onChange={(e) => setStudentNameInput(e.target.value)}
              required
            />
            <Input
              label="Kelas"
              value={classInput}
              onChange={(e) => setClassInput(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Kategori Pelanggaran
              </label>
              <select
                value={categoryInput}
                onChange={(e) => {
                  const cat = e.target.value as ViolationSeverity;
                  setCategoryInput(cat);
                  setPointsInput(cat === ViolationSeverity.RINGAN ? 10 : cat === ViolationSeverity.SEDANG ? 25 : 50);
                }}
                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value={ViolationSeverity.RINGAN}>Ringan (5-15 Poin)</option>
                <option value={ViolationSeverity.SEDANG}>Sedang (20-40 Poin)</option>
                <option value={ViolationSeverity.BERAT}>Berat (50-100 Poin)</option>
              </select>
            </div>

            <Input
              label="Bobot Poin Sanksi"
              type="number"
              value={pointsInput.toString()}
              onChange={(e) => setPointsInput(Number(e.target.value))}
              required
            />
          </div>

          <Input
            label="Judul Pelanggaran"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Contoh: Merokok di area toilet sekolah"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Kronologi / Keterangan Kejadian
            </label>
            <textarea
              className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 min-h-[90px] focus:ring-2 focus:ring-sky-100 focus:border-sky-500"
              placeholder="Jelaskan saksi, barang bukti, dan waktu kejadian..."
              value={descInput}
              onChange={(e) => setDescInput(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={needsSummons}
              onChange={(e) => setNeedsSummons(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-400"
            />
            <span>Terbitkan Surat Panggilan Orang Tua ke Sekolah</span>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCaseModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="destructive">
              Simpan Kasus Pelanggaran
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Printable Surat Panggilan Orang Tua */}
      <Modal
        isOpen={!!selectedLetterCase}
        onClose={() => setSelectedLetterCase(null)}
        title="Surat Panggilan Orang Tua Siswa"
        description="Template resmi panggilan wali murid SMKN 1 Garut"
        maxWidth="2xl"
      >
        {selectedLetterCase && (
          <div className="space-y-4">
            {/* Official Letter Container */}
            <div className="p-6 border border-slate-300 rounded-xl bg-white text-slate-900 font-serif text-xs space-y-4 shadow-sm">
              {/* Letterhead */}
              <div className="text-center border-b-2 border-black pb-3 space-y-0.5">
                <p className="font-bold text-sm uppercase tracking-wide">
                  PEMERINTAH DAERAH PROVINSI JAWA BARAT
                </p>
                <p className="font-extrabold text-base uppercase">
                  DINAS PENDIDIKAN — CABANG DINAS WILAYAH XI
                </p>
                <p className="font-extrabold text-lg uppercase tracking-wider">
                  SMK NEGERI 1 GARUT
                </p>
                <p className="text-[10px] font-sans text-slate-600">
                  Jl. Cimanuk No. 309A, Tarogong Kidul, Garut 44151 · Telp: (0262) 233316
                </p>
              </div>

              {/* Letter Meta */}
              <div className="flex justify-between font-sans text-[11px] pt-2">
                <div>
                  <p>Nomor: 421.5/BK-SMK1/2026/089</p>
                  <p>Lampiran: -</p>
                  <p>Perihal: <strong className="font-bold">Panggilan Orang Tua / Wali Siswa</strong></p>
                </div>
                <div className="text-right">
                  <p>Garut, 16 Agustus 2026</p>
                  <p className="mt-2 text-left">Kepada Yth,</p>
                  <p className="font-bold text-left">Orang Tua / Wali dari {selectedLetterCase.studentName}</p>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-2 leading-relaxed text-[11px] font-sans">
                <p>Dengan hormat,</p>
                <p>
                  Sehubungan dengan adanya evaluasi perkembangan kedisiplinan putra/putri Bapak/Ibu di SMKN 1 Garut terkait hal berikut:
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <p>• <strong>Nama Siswa:</strong> {selectedLetterCase.studentName} ({selectedLetterCase.className})</p>
                  <p>• <strong>Pelanggaran:</strong> {selectedLetterCase.title}</p>
                  <p>• <strong>Akumulasi Poin:</strong> {selectedLetterCase.points} Poin (Kategori: {selectedLetterCase.category})</p>
                </div>
                <p>
                  Maka kami mengharapkan kehadiran Bapak/Ibu pada:
                </p>
                <p className="pl-4">
                  <strong>Hari / Tanggal:</strong> Selasa, 18 Agustus 2026<br />
                  <strong>Waktu:</strong> 09.00 WIB s.d Selesai<br />
                  <strong>Tempat:</strong> Ruang Bimbingan & Konseling (BK) SMKN 1 Garut
                </p>
                <p>
                  Demikian surat panggilan ini kami sampaikan, atas perhatian dan kerja samanya kami ucapkan terima kasih.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 font-sans text-[11px] pt-6 text-center">
                <div>
                  <p>Guru Bimbingan Konseling,</p>
                  <div className="h-12" />
                  <p className="font-bold underline">Siti Rahmawati, S.Pd</p>
                  <p className="text-[10px] text-slate-500">NIP. 198703152011012002</p>
                </div>
                <div>
                  <p>Mengetahui, Kepala Sekolah</p>
                  <div className="h-12" />
                  <p className="font-bold underline">Dr. H. Dadang Johar Arifin, M.M</p>
                  <p className="text-[10px] text-slate-500">NIP. 196805121994031004</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedLetterCase(null)}>
                Tutup
              </Button>
              <Button
                variant="gradient"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer className="h-4 w-4" />
                Cetak / Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
