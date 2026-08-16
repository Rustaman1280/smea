"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, TaskColumn, TaskPriority } from "@superapp/types";
import {
  KanbanSquare,
  Github,
  ExternalLink,
  Plus,
  CheckCircle2,
  Clock,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Sparkles,
  BookOpen,
  Send,
  Building,
  Check,
  MessageSquare,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { AccessRestricted } from "@/components/ui/access-restricted";

interface TaskItem {
  id: string;
  title: string;
  column: TaskColumn;
  priority: TaskPriority;
  assignee: string;
}

interface PklJournalItem {
  id: string;
  companyName: string;
  date: string;
  activity: string;
  competency: string;
  isVerified: boolean;
  supervisorNotes?: string;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: "t-1", title: "Desain ERD & Skema Database Prisma 9 Modul", column: TaskColumn.DONE, priority: TaskPriority.HIGH, assignee: "Ahmad Fauzi" },
  { id: "t-2", title: "Implementasi REST API NestJS & JWT Auth RBAC", column: TaskColumn.DONE, priority: TaskPriority.HIGH, assignee: "Ahmad Fauzi" },
  { id: "t-3", title: "Slicing UI Next.js App Router & Tailwind CSS", column: TaskColumn.IN_PROGRESS, priority: TaskPriority.HIGH, assignee: "Nabila Putri" },
  { id: "t-4", title: "Integrasi Real-time Socket.IO Notifications", column: TaskColumn.TODO, priority: TaskPriority.MEDIUM, assignee: "Ahmad Fauzi" },
  { id: "t-5", title: "Uji Coba PWA & Cetak Struk Thermal Kasir", column: TaskColumn.REVIEW, priority: TaskPriority.LOW, assignee: "Bima Pratama" },
];

const INITIAL_JOURNALS: PklJournalItem[] = [
  {
    id: "j-1",
    companyName: "PT Telkom Indonesia (Witel Garut)",
    date: "15 Agustus 2026",
    activity: "Melakukan instalasi router MikroTik dan konfigurasi VLAN jaringan fiber optic kantor.",
    competency: "Routing, Switching, Network Infrastructure & Cable Splicing",
    isVerified: true,
    supervisorNotes: "Kerja sangat rapi dan teliti dalam dokumentasi topologi.",
  },
  {
    id: "j-2",
    companyName: "PT Telkom Indonesia (Witel Garut)",
    date: "14 Agustus 2026",
    activity: "Troubleshooting koneksi Wi-Fi hotspot pelanggan dan penarikan kabel LAN CAT6.",
    competency: "Network Troubleshooting & Customer Support",
    isVerified: true,
  },
];

const ALLOWED_ROLES = [
  UserRole.SISWA,
  UserRole.GURU,
  UserRole.WALI_KELAS,
  UserRole.ADMIN,
  UserRole.KEPSEK,
];

export default function ProjectTrackerPage() {
  const { user } = useAuthStore();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return (
      <AccessRestricted
        moduleTitle="7. Project Tracker & Jurnal PKL"
        allowedRoles={ALLOWED_ROLES}
      />
    );
  }

  const isTeacher = user.role === UserRole.GURU || user.role === UserRole.WALI_KELAS || user.role === UserRole.ADMIN;

  const [activeTab, setActiveTab] = useState<"KANBAN" | "PKL">("KANBAN");

  // Kanban States
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskAssignee, setTaskAssignee] = useState("Ahmad Fauzi");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);

  // PKL States
  const [journals, setJournals] = useState<PklJournalItem[]>(INITIAL_JOURNALS);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [companyInput, setCompanyInput] = useState("PT Telkom Indonesia (Witel Garut)");
  const [activityInput, setActivityInput] = useState("");
  const [competencyInput, setCompetencyInput] = useState("");

  const handleMoveTask = (taskId: string, direction: "next" | "prev") => {
    const columnOrder = [TaskColumn.TODO, TaskColumn.IN_PROGRESS, TaskColumn.REVIEW, TaskColumn.DONE];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentIndex = columnOrder.indexOf(t.column);
        const newIndex =
          direction === "next"
            ? Math.min(currentIndex + 1, columnOrder.length - 1)
            : Math.max(currentIndex - 1, 0);
        return { ...t, column: columnOrder[newIndex] };
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title: taskTitle,
      column: TaskColumn.TODO,
      priority: taskPriority,
      assignee: taskAssignee,
    };

    setTasks([...tasks, newTask]);
    setIsTaskModalOpen(false);
    setTaskTitle("");
  };

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityInput) return;

    const newJournal: PklJournalItem = {
      id: `j-${Date.now()}`,
      companyName: companyInput,
      date: "16 Agustus 2026",
      activity: activityInput,
      competency: competencyInput,
      isVerified: false,
    };

    setJournals([newJournal, ...journals]);
    setIsJournalModalOpen(false);
    setActivityInput("");
    setCompetencyInput("");
  };

  const handleVerifyJournal = (id: string) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, isVerified: true, supervisorNotes: "Disetujui oleh Pembimbing." } : j))
    );
  };

  const columns = [
    { key: TaskColumn.TODO, title: "📋 To Do", color: "border-slate-300 bg-slate-50/70" },
    { key: TaskColumn.IN_PROGRESS, title: "🚀 In Progress", color: "border-sky-300 bg-sky-50/40" },
    { key: TaskColumn.REVIEW, title: "🔍 Review & Testing", color: "border-amber-300 bg-amber-50/40" },
    { key: TaskColumn.DONE, title: "✅ Done / Selesai", color: "border-emerald-300 bg-emerald-50/40" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              7. Project Tracker & Jurnal PKL
            </h1>
            <Badge variant="default">Modul 7</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Board Kanban tugas praktik kejuruan SMK (TeFa & Proyek Akhir) serta buku jurnal harian magang industri (PKL/Prakerin).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "KANBAN" ? (
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-purple-200"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tambah Task Baru
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 font-bold shadow-purple-200"
              onClick={() => setIsJournalModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Isi Jurnal PKL Hari Ini
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveTab("KANBAN")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "KANBAN"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Papan Kanban Proyek Kelas ({tasks.length} Task)
        </button>
        <button
          onClick={() => setActiveTab("PKL")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === "PKL"
              ? "bg-purple-600 text-white shadow-sm shadow-purple-200"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          Jurnal Harian PKL / Prakerin ({journals.length} Catatan)
        </button>
      </div>

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === "KANBAN" && (
        <div className="space-y-4">
          {/* Active Project Banner */}
          <div className="p-4 rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-900">
                  Aplikasi POS Kasir Kantin Berbasis Web & Mobile
                </span>
                <Badge variant="secondary" className="font-bold">Proyek Produktif RPL</Badge>
              </div>
              <p className="text-xs text-slate-600">
                Ketua Tim: <strong>Ahmad Fauzi</strong> · Pembimbing: <strong>Budi Santoso, S.Kom</strong> · Target Selesai: <strong>30 September 2026</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://github.com/smkn1garut/pos-canteen"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub Repo
              </a>
              <a
                href="https://pos-canteen.smkn1garut.sch.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-sm"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Demo Live
              </a>
            </div>
          </div>

          {/* 4 Columns Board */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.column === col.key);
              return (
                <div
                  key={col.key}
                  className={`rounded-3xl border ${col.color} p-3.5 flex flex-col min-h-[460px] shadow-sm`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                    <span className="text-xs font-bold text-slate-800">
                      {col.title}
                    </span>
                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-300 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="text-xs font-bold text-slate-900 leading-snug">
                            {task.title}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                          <Badge
                            variant={
                              task.priority === TaskPriority.HIGH
                                ? "destructive"
                                : task.priority === TaskPriority.MEDIUM
                                ? "warning"
                                : "secondary"
                            }
                            className="text-[9px] px-1.5 py-0 font-bold"
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-slate-500 font-semibold">
                            {task.assignee}
                          </span>
                        </div>

                        {/* Move Task Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => handleMoveTask(task.id, "prev")}
                            disabled={task.column === TaskColumn.TODO}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25"
                            title="Geser Mundur"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[10px] text-slate-400 font-mono font-medium">
                            Pindahkan
                          </span>
                          <button
                            onClick={() => handleMoveTask(task.id, "next")}
                            disabled={task.column === TaskColumn.DONE}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-25"
                            title="Geser Maju"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PKL JOURNAL */}
      {activeTab === "PKL" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {journals.map((j) => (
              <Card key={j.id} className="border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-purple-600" />
                      <h3 className="text-sm font-bold text-slate-900">
                        {j.companyName}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{j.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={j.isVerified ? "success" : "warning"}>
                      {j.isVerified ? "Tervalidasi Pembimbing" : "Menunggu Review"}
                    </Badge>
                    {isTeacher && !j.isVerified && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs py-1 h-7 font-bold"
                        onClick={() => handleVerifyJournal(j.id)}
                      >
                        <Check className="h-3 w-3" />
                        Validasi Jurnal
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1 text-xs">
                  <p className="font-bold text-slate-800">Aktivitas Industri Hari Ini:</p>
                  <p className="text-slate-600 leading-relaxed">{j.activity}</p>
                </div>

                <div className="text-xs text-slate-600">
                  <strong>Kompetensi yang Dipelajari:</strong> {j.competency}
                </div>

                {j.supervisorNotes && (
                  <div className="text-xs text-emerald-800 bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                    <strong>Catatan Pembimbing:</strong> {j.supervisorNotes}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Task */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Tambah Tugas Kanban Proyek"
        description="Masukkan item modul fitur atau pekerjaan kelompok."
        maxWidth="md"
      >
        <form onSubmit={handleAddTask} className="space-y-4 mt-2">
          <Input
            label="Nama Tugas / Modul"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Contoh: Pembuatan Fitur Cetak Struk Kasir"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Pelaksana (Assignee)"
              value={taskAssignee}
              onChange={(e) => setTaskAssignee(e.target.value)}
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Prioritas
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="w-full h-11 rounded-2xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
              >
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsTaskModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient" className="font-bold">
              Tambahkan ke Board
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Add PKL Journal */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        title="Isi Jurnal Harian PKL / Prakerin"
        description="Dokumentasikan kegiatan dan keahlian baru yang didapat di tempat magang industri."
        maxWidth="lg"
      >
        <form onSubmit={handleAddJournal} className="space-y-4 mt-2">
          <Input
            label="Nama Perusahaan / Instansi DUDI"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Uraian Aktivitas & Pekerjaan yang Dikerjakan
            </label>
            <textarea
              className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 min-h-[85px]"
              placeholder="Ceritakan detail tugas dan pekerjaan praktis hari ini..."
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              required
            />
          </div>

          <Input
            label="Kompetensi / Keterampilan Kejuruan yang Dipelajari"
            value={competencyInput}
            onChange={(e) => setCompetencyInput(e.target.value)}
            placeholder="Contoh: Konfigurasi MikroTik OSPF, Krimping RJ45"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsJournalModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient" className="font-bold">
              Kirim Jurnal untuk Diverifikasi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
