"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  BookOpenCheck,
  Calendar,
  FileText,
  Clock,
  ExternalLink,
  Plus,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Send,
  Download,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AccessRestricted } from "@/components/ui/access-restricted";

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  subjectName: string;
  room: string;
  teacherName: string;
}

interface MaterialItem {
  id: string;
  subjectName: string;
  title: string;
  description: string;
  uploadedAt: string;
  linkUrl?: string;
}

interface AssignmentItem {
  id: string;
  subjectName: string;
  title: string;
  description: string;
  deadline: string;
  submitted: boolean;
  score?: number;
  feedback?: string;
}

const SCHEDULES: ScheduleItem[] = [
  { id: "sc-1", day: "Senin", time: "07:15 - 09:30", subjectName: "Pemrograman Web & Mobile", room: "Lab RPL 2", teacherName: "Budi Santoso, S.Kom" },
  { id: "sc-2", day: "Senin", time: "09:45 - 12:00", subjectName: "Bahasa Indonesia Kejuruan", room: "Ruang XII RPL 1", teacherName: "Dra. Hj. Nurhayati" },
  { id: "sc-3", day: "Selasa", time: "07:15 - 11:30", subjectName: "Pemodelan Perangkat Lunak & UML", room: "Lab RPL 1", teacherName: "Budi Santoso, S.Kom" },
  { id: "sc-4", day: "Rabu", time: "07:15 - 10:15", subjectName: "Basis Data & Cloud Backend", room: "Lab Server", teacherName: "Dedi Supriadi, M.T" },
  { id: "sc-5", day: "Kamis", time: "07:15 - 09:30", subjectName: "Matematika Terapan Kejuruan", room: "Ruang XII RPL 1", teacherName: "Rahmat Hidayat, M.Pd" },
  { id: "sc-6", day: "Jumat", time: "07:15 - 09:15", subjectName: "Pendidikan Agama Islam", room: "Masjid Al-Ikhlas", teacherName: "Ust. M. Ridwan, S.Ag" },
];

const MATERIALS: MaterialItem[] = [
  {
    id: "mat-1",
    subjectName: "Pemrograman Web & Mobile",
    title: "Modul 04 - Arsitektur Clean Architecture NestJS & Next.js App Router",
    description: "Panduan lengkap dependency injection, DTO validation, Prisma ORM, dan JWT authentication.",
    uploadedAt: "15 Agustus 2026",
    linkUrl: "https://docs.nestjs.com",
  },
  {
    id: "mat-2",
    subjectName: "Basis Data & Cloud Backend",
    title: "Modul 03 - PostgreSQL Indexing & Query Optimization",
    description: "Teknik optimasi performa query SQL, relasi foreign key, dan schema migration.",
    uploadedAt: "13 Agustus 2026",
    linkUrl: "https://www.prisma.io/docs",
  },
];

const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: "ass-1",
    subjectName: "Pemrograman Web & Mobile",
    title: "Praktikum 03: Pembuatan REST API CRUD dengan NestJS & Prisma",
    description: "Buat endpoint CRUD lengkap dengan DTO class-validator, custom guard RBAC, dan upload file swagger.",
    deadline: "20 Agustus 2026, 23:59 WIB",
    submitted: true,
    score: 95,
    feedback: "Struktur arsitektur sangat bersih, penggunaan decorator dan DTO validation sangat baik!",
  },
  {
    id: "ass-2",
    subjectName: "Basis Data & Cloud Backend",
    title: "Tugas Mandiri: Perancangan ERD & Skema Database Superapp",
    description: "Rancang ERD database yang memuat 9 modul sekolah dengan minimal 15 entitas relasional.",
    deadline: "22 Agustus 2026, 23:59 WIB",
    submitted: false,
  },
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

export default function MataPelajaranPage() {
  const { user } = useAuthStore();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <AccessRestricted
        moduleTitle="6. Mata Pelajaran & LMS"
        allowedRoles={ALLOWED_ROLES}
      />
    );
  }

  const isTeacher = user.role === UserRole.GURU || user.role === UserRole.ADMIN;

  const [activeTab, setActiveTab] = useState<"TUGAS" | "MATERI" | "JADWAL">("TUGAS");
  const [assignments, setAssignments] = useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);

  // Submit Modal States
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentItem | null>(null);
  const [submissionLink, setSubmissionLink] = useState("");
  const [submissionNote, setSubmissionNote] = useState("");

  // Create Assignment Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [assTitle, setAssTitle] = useState("");
  const [assSubject, setAssSubject] = useState("Pemrograman Web & Mobile");
  const [assDesc, setAssDesc] = useState("");
  const [assDeadline, setAssDeadline] = useState("2026-08-25T23:59");

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setAssignments((prev) =>
      prev.map((a) =>
        a.id === selectedAssignment.id ? { ...a, submitted: true } : a
      )
    );

    setIsSubmitModalOpen(false);
    setSubmissionLink("");
    setSubmissionNote("");
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assTitle) return;

    const newAss: AssignmentItem = {
      id: `ass-${Date.now()}`,
      subjectName: assSubject,
      title: assTitle,
      description: assDesc,
      deadline: assDeadline,
      submitted: false,
    };

    setAssignments([newAss, ...assignments]);
    setIsCreateModalOpen(false);
    setAssTitle("");
    setAssDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              6. Mata Pelajaran & LMS
            </h1>
            <Badge variant="default">Modul 6</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Jadwal mingguan, repositori modul pembelajaran digital SMK, dan pengumpulan tugas terstruktur.
          </p>
        </div>

        {isTeacher && (
          <Button
            variant="default"
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 font-bold shadow-cyan-200"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Buat Tugas Baru
          </Button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("TUGAS")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "TUGAS"
              ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Tugas & Nilai ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab("MATERI")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "MATERI"
              ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Materi Pembelajaran ({MATERIALS.length})
        </button>
        <button
          onClick={() => setActiveTab("JADWAL")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "JADWAL"
              ? "bg-sky-600 text-white shadow-sm shadow-sky-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Jadwal Mingguan Kelas
        </button>
      </div>

      {/* TAB 1: TUGAS */}
      {activeTab === "TUGAS" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((ass) => (
              <Card
                key={ass.id}
                className="flex flex-col justify-between border-slate-200 hover:border-sky-300 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-2">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                      {ass.subjectName}
                    </span>
                    <Badge variant={ass.submitted ? "success" : "warning"}>
                      {ass.submitted ? "Sudah Dikumpul" : "Belum Dikumpul"}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">
                    {ass.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {ass.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>Deadline: <strong>{ass.deadline}</strong></span>
                  </div>

                  {ass.score !== undefined && (
                    <div className="mt-3 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900">
                          Nilai Guru: {ass.score} / 100
                        </span>
                        <Badge variant="success">Tuntas (A)</Badge>
                      </div>
                      {ass.feedback && (
                        <p className="text-[11px] text-emerald-800 italic">
                          "{ass.feedback}"
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Format: Link GitHub / Dokumen Drive
                  </span>

                  {user?.role === UserRole.SISWA ? (
                    <Button
                      variant={ass.submitted ? "outline" : "gradient"}
                      size="sm"
                      onClick={() => {
                        setSelectedAssignment(ass);
                        setIsSubmitModalOpen(true);
                      }}
                      className="font-bold text-xs"
                    >
                      {ass.submitted ? "Perbarui Pengumpulan" : "Kumpul Tugas"}
                    </Button>
                  ) : (
                    <Badge variant="info">32 Siswa Mengumpulkan</Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MATERI */}
      {activeTab === "MATERI" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MATERIALS.map((mat) => (
              <Card key={mat.id} className="border-slate-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-md">
                      {mat.subjectName}
                    </span>
                    <span className="text-[11px] text-slate-400">{mat.uploadedAt}</span>
                  </div>
                  <CardTitle className="text-base mt-2">{mat.title}</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {mat.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <a
                    href={mat.linkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-800"
                  >
                    <BookOpen className="h-4 w-4" />
                    Buka Dokumen / Tautan Materi
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL */}
      {activeTab === "JADWAL" && (
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Pelajaran Kelas XII RPL 1</CardTitle>
            <CardDescription>Tahun Ajaran 2025/2026 · Semester Ganjil</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                    <th className="pb-3">Hari</th>
                    <th className="pb-3">Waktu</th>
                    <th className="pb-3">Mata Pelajaran</th>
                    <th className="pb-3">Ruangan</th>
                    <th className="pb-3">Guru Pengampu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {SCHEDULES.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80">
                      <td className="py-3 font-bold text-slate-900">{s.day}</td>
                      <td className="py-3 font-semibold text-sky-800">{s.time} WIB</td>
                      <td className="py-3 font-bold text-slate-900">{s.subjectName}</td>
                      <td className="py-3">{s.room}</td>
                      <td className="py-3 text-slate-500">{s.teacherName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Kumpul Tugas */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title={`Kumpul Tugas: ${selectedAssignment?.title || ""}`}
        description="Lampirkan link hasil pengerjaan tugas praktikum (GitHub / Google Drive)."
        maxWidth="md"
      >
        <form onSubmit={handleSubmitTask} className="space-y-4 mt-2">
          <Input
            label="Tautan / URL Submission"
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://github.com/username/project-repo"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Catatan untuk Guru (Opsional)
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 min-h-[80px]"
              placeholder="Jelaskan fitur yang sudah selesai atau kendala praktikum..."
              value={submissionNote}
              onChange={(e) => setSubmissionNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient" className="font-bold">
              <Send className="h-4 w-4" />
              Kirimkan Tugas
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Buat Tugas (Guru) */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat Tugas Kelas Baru"
        description="Rancang instruksi praktikum dan deadline pengerjaan siswa."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4 mt-2">
          <Input
            label="Judul Tugas / Praktikum"
            value={assTitle}
            onChange={(e) => setAssTitle(e.target.value)}
            placeholder="Contoh: Praktikum Pemrograman Framework Next.js"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Mata Pelajaran"
              value={assSubject}
              onChange={(e) => setAssSubject(e.target.value)}
              required
            />
            <Input
              label="Batas Akhir (Deadline)"
              type="datetime-local"
              value={assDeadline}
              onChange={(e) => setAssDeadline(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Deskripsi Soal & Ketentuan
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 min-h-[85px]"
              placeholder="Tuliskan spesifikasi pengerjaan tugas..."
              value={assDesc}
              onChange={(e) => setAssDesc(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Publikasikan Tugas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
