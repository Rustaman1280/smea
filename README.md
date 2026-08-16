# 🎓 Superapp SMKN 1 Garut
### Platform Terpadu Siswa, Guru, dan Staff Sekolah Kejuruan (SMK)

Superapp SMKN 1 Garut menyatukan kebutuhan administrasi, kegiatan akademik, kedisiplinan, sarana prasarana, kantin sekolah, dan hotspot internet dalam satu kesatuan sistem **Monorepo** berbasis **NestJS** & **Next.js App Router**.

---

## 🏛️ Arsitektur Monorepo

```
smea/
├── apps/
│   ├── api/                     # Backend NestJS (TypeScript + Prisma ORM + Swagger + WebSockets)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # Skema PostgreSQL lengkap semua entitas
│   │   │   └── seed.ts         # Data awal & akun demo 11 peran pengguna
│   │   └── src/
│   │       ├── common/         # Guards (RolesGuard, JwtAuthGuard), Decorators (@Roles, @CurrentUser)
│   │       └── modules/        # 9 Modul Inti + Auth SSO + Users + Notifications
│   └── web/                     # Frontend Next.js 15 App Router (Tailwind CSS, TanStack Query, Zustand)
│       └── src/
│           ├── app/
│           │   ├── (auth)/login/        # SSO Login & 1-Click Interactive Demo Role Switcher
│           │   └── (dashboard)/         # Unified Dashboard & 9 Halaman Modul
│           ├── components/layouts/      # Desktop Sidebar & Mobile-first Bottom Nav
│           └── stores/                  # Auth Store & Role Persistence
├── packages/
│   └── types/                   # Shared TypeScript Interfaces & DTO Contracts
├── docker-compose.yml           # PostgreSQL 16 & Redis Container Services
├── turbo.json                   # Turborepo Build Pipeline
└── package.json                 # Monorepo Workspaces Root
```

---

## 🚀 9 Modul & Fitur Terintegrasi

| No | Modul | Rute Frontend | Endpoint API Utama | Hak Akses Utama |
|---|---|---|---|---|
| 1 | **Absensi Digital Siswa** | `/absensi-siswa` | `/api/attendance` | Siswa, Guru, Wali Kelas, BK, Kepsek |
| 2 | **Absen Guru & Log BKD** | `/absen-guru` | `/api/teacher-attendance` | Guru, Guru BK, Wali Kelas, Kepsek |
| 3 | **BK & Pelanggaran** | `/bk-pelanggaran` | `/api/discipline` | Guru BK, Wali Kelas, Siswa (data pribadi) |
| 4 | **Showcase Kantin** | `/kantin` | `/api/canteen` | Semua Peran, Operator Kantin (Kelola Stok) |
| 5 | **Ekstrakurikuler** | `/ekskul` | `/api/extracurricular` | Siswa (Daftar), Pembina Ekskul (Kelola Prestasi) |
| 6 | **Mata Pelajaran & LMS** | `/mata-pelajaran` | `/api/subjects` | Siswa (Kumpul Tugas), Guru (Upload Materi & Nilai) |
| 7 | **Project & Jurnal PKL** | `/project-tracker` | `/api/project-tracker` | Siswa (Board Kanban, Jurnal), Guru Pembimbing |
| 8 | **Inventaris Sarpras** | `/inventaris` | `/api/inventory` | Siswa/Guru (Pinjam), Petugas Sarpras (Approval) |
| 9 | **ISP Voucher Hotspot** | `/isp-voucher` | `/api/voucher` | Siswa/Guru (Beli Voucher), Operator ISP (Batch Gen) |

---

## 🔑 Akun Uji Coba Demo (11 Peran Pengguna)

Semua akun menggunakan kata sandi default: `password123`

| Peran (Role) | Nama Pengguna | Email Login | Keterangan Akses |
|---|---|---|---|
| **SISWA** | Ahmad Fauzi | `siswa@smkn1garut.sch.id` | Absen QR, kumpul tugas LMS, daftar ekskul, beli voucher, jurnal PKL |
| **GURU** | Budi Santoso, S.Kom | `guru@smkn1garut.sch.id` | Absen masuk/BKD, upload materi mapel, koreksi & nilai tugas siswa |
| **GURU_BK** | Siti Rahmawati, S.Pd | `gurubk@smkn1garut.sch.id` | Input kasus pelanggaran, sesi konseling, cetak Surat Panggilan Ortu |
| **WALI_KELAS** | Dedi Supriadi, M.T | `walikelas@smkn1garut.sch.id` | Rekap kehadiran XII RPL 1, monitor kedisiplinan perwalian |
| **PEMBINA_EKSKUL** | Hendrik Kurniawan, S.Pd | `pembina@smkn1garut.sch.id` | Kelola keanggotaan klub Robotik, publikasi piagam prestasi kejuaraan |
| **STAFF_TU** | Dewi Lestari, S.AP | `stafftu@smkn1garut.sch.id` | Rekapitulasi absensi sekolah, persuratan & administrasi |
| **PETUGAS_SARPRAS** | Asep Solihin | `sarpras@smkn1garut.sch.id` | Master aset lab, persetujuan peminjaman barang, log maintenance |
| **OPERATOR_KANTIN** | Ibu Eni Rohaeni | `kantin@smkn1garut.sch.id` | Tambah menu kantin, toggle ketersediaan stok habis/tersedia instan |
| **OPERATOR_ISP** | Rian Hidayat | `isp@smkn1garut.sch.id` | Generate batch kode voucher hotspot, analitik pendapatan kas ISP |
| **ADMIN** | Super Admin | `admin@smkn1garut.sch.id` | Hak akses penuh atas seluruh modul dan manajemen user |
| **KEPSEK** | Dr. H. Dadang Johar Arifin, M.M | `kepsek@smkn1garut.sch.id` | Dashboard eksekutif, rekap kehadiran seluruh guru & siswa |

*(Catatan: Anda juga dapat berganti peran secara instan menggunakan tombol **Role Switcher** di bagian kanan atas aplikasi atau di halaman login).*

---

## 🛠️ Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 20+
- Docker & Docker Compose (untuk database PostgreSQL lokal)

### 2. Jalankan PostgreSQL via Docker
```bash
docker-compose up -d
```

### 3. Generate Skema & Seeding Data Awal
```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database PostgreSQL
npm run db:push

# Jalankan seeder akun dan data 9 modul
npm run db:seed
```

### 4. Jalankan Aplikasi (Fullstack Monorepo)
```bash
# Menjalankan Backend API (Port 4000) & Frontend Next.js (Port 3000) sekaligus:
npm run dev

# Atau jalankan secara terpisah:
npm run dev:api    # Menjalankan NestJS di http://localhost:4000
npm run dev:web    # Menjalankan Next.js di http://localhost:3000
```

### 5. Dokumentasi API Swagger
Buka browser dan akses:
👉 **`http://localhost:4000/api/docs`**

---

## 📜 Riwayat Git Commit per Fitur

Proyek ini dibangun secara bertahap dan terstruktur dengan commit terpisah untuk setiap fiturnya:
- `feat(auth): setup monorepo, prisma schema, jwt auth, and rbac layouts`
- `feat(attendance): add digital student qr attendance, scanner, and class recap`
- `feat(teacher-attendance): add teacher check-in and bkd teaching log`
- `feat(discipline): add counseling and violation points system with summons generator`
- `feat(canteen): add digital canteen showcase and menu management`
- `feat(extracurricular): add club registration, schedule, and attendance`
- `feat(subjects): add subject schedules, material repository, and assignment grading`
- `feat(project-tracker): add kanban board, pkl journal, and supervisor reviews`
- `feat(inventory): add asset management, borrowing workflow, and maintenance logs`
- `feat(isp-voucher): add wifi voucher generator, purchase system, and sales analytics`
- `feat(dashboard): finalize unified superapp dashboard, swagger docs, and socket gateway`
