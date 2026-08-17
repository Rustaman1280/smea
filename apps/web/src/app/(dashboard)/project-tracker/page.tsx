"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole, TaskColumn, TaskPriority } from "@superapp/types";
import {
  KanbanSquare,
  Plus,
  ChevronRight,
  ChevronLeft,
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
      prev.map((j) => (j.id === id ? { ...j, isVerified: true, supervisorNotes: "Disetujui dan diverifikasi oleh Pembimbing PKL." } : j))
    );
  };

  const columns = [
    { key: TaskColumn.TODO, title: "📋 To Do", colorClass: "border-border bg-muted/20" },
    { key: TaskColumn.IN_PROGRESS, title: "🚀 In Progress", colorClass: "border-sky-500/20 bg-sky-500/5" },
    { key: TaskColumn.REVIEW, title: "🔍 Review & Testing", colorClass: "border-amber-500/20 bg-amber-500/5" },
    { key: TaskColumn.DONE, title: "✅ Done / Selesai", colorClass: "border-emerald-500/20 bg-emerald-500/5" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              7. Project Tracker & Jurnal PKL
            </h1>
            <Badge variant="default">Modul 7</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Board Kanban proyek kejuruan RPL/TKJ dan pencatatan jurnal harian Praktik Kerja Lapangan (PKL) industri.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "KANBAN" ? (
            <Button
              variant="default"
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold"
              onClick={() => setIsTaskModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Tambah Task Proyek
            </Button>
          ) : (
            !isTeacher && (
              <Button
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold"
                onClick={() => setIsJournalModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Catat Log PKL Hari Ini
              </Button>
            )
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("KANBAN")}
          className={`px-4 py-2 min-h-[38px] text-xs font-semibold rounded-xl transition-all ${
            activeTab === "KANBAN"
              ? "bg-purple-600 text-white font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Board Proyek Kejuruan ({tasks.length} Task)
        </button>
        <button
          onClick={() => setActiveTab("PKL")}
          className={`px-4 py-2 min-h-[38px] text-xs font-semibold rounded-xl transition-all ${
            activeTab === "PKL"
              ? "bg-purple-600 text-white font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Jurnal Harian PKL ({journals.length} Log)
        </button>
      </div>

      {/* TAB 1: KANBAN BOARD */}
      {activeTab === "KANBAN" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.column === col.key);
              return (
                <div
                  key={col.key}
                  className={`rounded-2xl border p-3.5 space-y-3 flex flex-col ${col.colorClass}`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-foreground">
                      {col.title}
                    </span>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[500px]">
                    {colTasks.length === 0 && (
                      <div className="py-8 text-center text-xs text-muted-foreground italic">
                        Belum ada task di kolom ini
                      </div>
                    )}
                    {colTasks.map((t) => (
                      <div
                        key={t.id}
                        className="rounded-xl border border-border bg-card p-3 space-y-2 shadow-sm hover:border-purple-500/40 transition-all"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <Badge
                            variant={
                              t.priority === TaskPriority.HIGH
                                ? "destructive"
                                : t.priority === TaskPriority.MEDIUM
                                ? "warning"
                                : "secondary"
                            }
                            className="text-[9px] py-0 px-1.5"
                          >
                            {t.priority}
                          </Badge>
                          <span className="text-[10px] font-medium text-muted-foreground truncate">
                            {t.assignee}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-foreground leading-snug">
                          {t.title}
                        </p>

                        <div className="flex items-center justify-between pt-1 border-t border-border/60">
                          <button
                            onClick={() => handleMoveTask(t.id, "prev")}
                            disabled={t.column === TaskColumn.TODO}
                            className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
                            title="Pindah ke kolom sebelumnya"
                            aria-label="Pindah ke kolom sebelumnya"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveTask(t.id, "next")}
                            disabled={t.column === TaskColumn.DONE}
                            className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-20 transition-colors"
                            title="Pindah ke kolom berikutnya"
                            aria-label="Pindah ke kolom berikutnya"
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
              <Card key={j.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      <h3 className="text-sm font-bold text-foreground">
                        {j.companyName}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{j.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={j.isVerified ? "success" : "warning"}>
                      {j.isVerified ? "Tervalidasi Pembimbing" : "Menunggu Review"}
                    </Badge>
                    {isTeacher && !j.isVerified && (
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs py-1 h-7 font-semibold"
                        onClick={() => handleVerifyJournal(j.id)}
                      >
                        <Check className="h-3 w-3" />
                        Validasi Jurnal
                      </Button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-muted/40 rounded-2xl border border-border space-y-1 text-xs">
                  <p className="font-semibold text-foreground">Aktivitas Industri Hari Ini:</p>
                  <p className="text-muted-foreground leading-relaxed">{j.activity}</p>
                </div>

                <div className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Kompetensi yang Dipelajari:</strong> {j.competency}
                </div>

                {/* FIXED: High Contrast Catatan Pembimbing Box */}
                {j.supervisorNotes && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-300 bg-emerald-500/10 p-3.5 rounded-xl border border-emerald-500/20 flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-700 dark:text-emerald-200 font-semibold">Catatan Pembimbing:</strong>{" "}
                      <span>{j.supervisorNotes}</span>
                    </div>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Prioritas
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="w-full h-11 rounded-2xl border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <Button type="submit" variant="default" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold">
              Simpan Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Add PKL Journal */}
      <Modal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        title="Input Log Jurnal PKL Harian"
        description="Catat aktivitas dan kompetensi industri harian yang telah dipelajari."
        maxWidth="md"
      >
        <form onSubmit={handleAddJournal} className="space-y-4 mt-2">
          <Input
            label="Nama Perusahaan / Industri Mitra"
            value={companyInput}
            onChange={(e) => setCompanyInput(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas Industri Hari Ini
            </label>
            <textarea
              className="w-full rounded-2xl border border-input bg-card p-3.5 text-sm text-foreground min-h-[85px] focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Jelaskan pekerjaan atau troubleshooting yang Anda tangani..."
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              required
            />
          </div>

          <Input
            label="Kompetensi Kejuruan Terkait"
            value={competencyInput}
            onChange={(e) => setCompetencyInput(e.target.value)}
            placeholder="Contoh: Network Troubleshooting, Splicing FO"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsJournalModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="default" className="bg-purple-600 hover:bg-purple-500 text-white font-semibold">
              Simpan Jurnal PKL
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
