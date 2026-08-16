"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";
import { UserRole } from "@superapp/types";
import {
  Trophy,
  Users,
  Calendar,
  MapPin,
  Plus,
  Medal,
  CheckCircle2,
  Sparkles,
  Bot,
  Flame,
  Music,
  Dumbbell,
  Compass,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";

interface ClubItem {
  id: string;
  name: string;
  category: string;
  coachName: string;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  description: string;
  memberCount: number;
  isRecruiting: boolean;
  achievements: { title: string; rank: string; year: number }[];
  isJoined?: boolean;
}

const INITIAL_CLUBS: ClubItem[] = [
  {
    id: "club-1",
    name: "SMK 1 Robotic & IoT Club",
    category: "TEKNOLOGI",
    coachName: "Hendrik Kurniawan, S.Pd",
    scheduleDay: "Kamis",
    scheduleTime: "15:30 - 17:30 WIB",
    location: "Lab Hardware & IoT SMKN 1 Garut",
    description: "Riset mikrokontroler ESP32, Arduino, perakitan robot Line Follower & persiapan LKS Robotika.",
    memberCount: 28,
    isRecruiting: true,
    isJoined: true,
    achievements: [
      { title: "Lomba Robotika Nasional POLBAN", rank: "Juara 1", year: 2025 },
      { title: "LKS SMK Bidang Mobile Robotics Prov. Jabar", rank: "Juara 2", year: 2024 },
    ],
  },
  {
    id: "club-2",
    name: "Paskibra SMKN 1 Garut (KORPASKI)",
    category: "KEPANDUAN",
    coachName: "Pelatih Paskibra Garut",
    scheduleDay: "Selasa & Jumat",
    scheduleTime: "15:45 - 17:45 WIB",
    location: "Lapangan Upacara Utama",
    description: "Pembinaan disiplin, baris-berbaris formal, formasi variasi, dan kepemimpinan pemuda.",
    memberCount: 45,
    isRecruiting: true,
    isJoined: false,
    achievements: [
      { title: "LKBB Tingkat Priangan Timur", rank: "Juara Umum", year: 2025 },
    ],
  },
  {
    id: "club-3",
    name: "Palang Merah Remaja (PMR WIRA)",
    category: "KEAGAMAAN",
    coachName: "Pembina PMR & Tim Medis",
    scheduleDay: "Rabu",
    scheduleTime: "15:30 - 17:00 WIB",
    location: "Ruang UKS & Aula Kesiswaan",
    description: "Pertolongan pertama, donor darah, tandu darurat, dan aksi sosial kemanusiaan.",
    memberCount: 36,
    isRecruiting: true,
    isJoined: false,
    achievements: [
      { title: "Jumbara PMR Tingkat Kabupaten Garut", rank: "Juara Harapan 1", year: 2024 },
    ],
  },
  {
    id: "club-4",
    name: "Futsal & Mini Soccer SMK 1",
    category: "OLAHRAGA",
    coachName: "Coach Deni Iskandar",
    scheduleDay: "Senin & Kamis",
    scheduleTime: "16:00 - 18:00 WIB",
    location: "Lapangan Futsal SMKN 1 Garut",
    description: "Latihan fisik, taktik sepak bola modern, dan turnamen antar-pelajar se-Jawa Barat.",
    memberCount: 40,
    isRecruiting: false,
    isJoined: false,
    achievements: [
      { title: "Garut Futsal Student Cup", rank: "Juara 1", year: 2025 },
    ],
  },
];

export default function EkskulPage() {
  const { user } = useAuthStore();
  const isPembina = user?.role === UserRole.PEMBINA_EKSKUL || user?.role === UserRole.ADMIN;

  const [clubs, setClubs] = useState<ClubItem[]>(INITIAL_CLUBS);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<string>("club-1");
  const [achieveTitle, setAchieveTitle] = useState("");
  const [achieveRank, setAchieveRank] = useState("Juara 1");
  const [achieveYear, setAchieveYear] = useState("2026");

  const handleJoinClub = (clubId: string) => {
    setClubs((prev) =>
      prev.map((c) =>
        c.id === clubId
          ? { ...c, isJoined: true, memberCount: c.memberCount + 1 }
          : c
      )
    );
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!achieveTitle) return;

    setClubs((prev) =>
      prev.map((c) =>
        c.id === selectedClubId
          ? {
              ...c,
              achievements: [
                {
                  title: achieveTitle,
                  rank: achieveRank,
                  year: parseInt(achieveYear) || 2026,
                },
                ...c.achievements,
              ],
            }
          : c
      )
    );

    setIsAchievementModalOpen(false);
    setAchieveTitle("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              5. Ekstrakurikuler & Prestasi
            </h1>
            <Badge variant="success">Modul 5</Badge>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pendaftaran ekskul online, jadwal latihan mingguan, dan galeri piagam kejuaraan sekolah.
          </p>
        </div>

        {isPembina && (
          <Button
            variant="default"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
            onClick={() => setIsAchievementModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Tambah Prestasi Kejuaraan
          </Button>
        )}
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <Card
            key={club.id}
            className="flex flex-col justify-between border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-tight">
                      {club.name}
                    </h3>
                    <Badge variant="secondary" className="text-[10px] mt-0.5">
                      {club.category}
                    </Badge>
                  </div>
                </div>

                {club.isJoined && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Terdaftar
                  </Badge>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                {club.description}
              </p>

              {/* Schedules and Info */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{club.scheduleDay}, {club.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{club.location}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-slate-200/60">
                  <Users className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>Pembina / Pelatih: <strong>{club.coachName}</strong> ({club.memberCount} Anggota)</span>
                </div>
              </div>

              {/* Achievements Showcase */}
              {club.achievements.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <Medal className="h-3.5 w-3.5 text-amber-500" />
                    Piagam Prestasi Terkini:
                  </p>
                  <div className="space-y-1">
                    {club.achievements.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs bg-amber-50/60 border border-amber-200/80 px-2.5 py-1.5 rounded-lg text-amber-900"
                      >
                        <span className="font-semibold">{a.title}</span>
                        <Badge variant="warning" className="text-[10px] bg-amber-100 text-amber-800">
                          {a.rank} ({a.year})
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Join Action */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Status: {club.isRecruiting ? "Membuka Anggota Baru" : "Pendaftaran Ditutup"}
              </span>

              {user?.role === UserRole.SISWA && (
                <Button
                  variant={club.isJoined ? "outline" : "gradient"}
                  size="sm"
                  disabled={club.isJoined || !club.isRecruiting}
                  onClick={() => handleJoinClub(club.id)}
                  className={club.isJoined ? "text-emerald-700 border-emerald-300" : ""}
                >
                  {club.isJoined ? "Sudah Bergabung" : "Daftar Ekskul Online"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Add Achievement */}
      <Modal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        title="Catat Piagam Prestasi Ekskul"
        description="Publikasikan gelar juara atau kejuaraan yang diraih oleh anggota ekskul."
        maxWidth="md"
      >
        <form onSubmit={handleAddAchievement} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Pilih Ekstrakurikuler
            </label>
            <select
              value={selectedClubId}
              onChange={(e) => setSelectedClubId(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
            >
              {clubs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nama Kejuaraan / Kompetisi"
            value={achieveTitle}
            onChange={(e) => setAchieveTitle(e.target.value)}
            placeholder="Contoh: Lomba Inovasi Teknologi Pelajar Jabar"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Peringkat Juara"
              value={achieveRank}
              onChange={(e) => setAchieveRank(e.target.value)}
              placeholder="Juara 1 / Emas"
              required
            />
            <Input
              label="Tahun"
              type="number"
              value={achieveYear}
              onChange={(e) => setAchieveYear(e.target.value)}
              placeholder="2026"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAchievementModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" variant="gradient">
              Simpan Piagam Prestasi
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
