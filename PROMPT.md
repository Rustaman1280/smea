# 🎓 Superapp SMKN 1 Garut
### Spesifikasi Fitur & Prompt Pengembangan — Backend NestJS · Frontend Next.js

> Dokumen ini dua-in-satu: (1) spesifikasi lengkap modul & arsitektur, dan (2) prompt siap-pakai di bagian paling akhir yang bisa langsung ditempel ke Claude Code, Cursor, atau AI coding assistant lain buat mulai scaffolding project.

---

## 1. Ringkasan Proyek

**Superapp SMKN 1 Garut** adalah platform terpadu yang menyatukan kebutuhan administrasi, akademik, dan kehidupan sekolah sehari-hari dalam satu aplikasi — dipakai oleh **siswa**, **guru**, dan **staff sekolah** dengan tampilan & akses yang disesuaikan per peran. Daripada 9 sistem terpisah (absensi manual, buku BK fisik, papan kantin, dst), semuanya hidup dalam satu backend & satu identitas login.

---

## 2. Peran Pengguna

| Peran | Deskripsi Singkat |
|---|---|
| **Siswa** | Pengguna harian utama — absen, lihat jadwal, ikut ekskul, kumpul tugas, dst |
| **Guru Mata Pelajaran** | Input nilai, kelola materi, absen mengajar |
| **Guru BK / Wali Kelas** | Akses modul BK & pelanggaran, approve izin siswa perwalian |
| **Pembina Ekskul** | Kelola anggota & absensi ekskul binaannya |
| **Staff TU / Admin** | Kelola data induk, surat-menyurat, master data |
| **Petugas Sarpras** | Kelola modul Inventaris |
| **Operator Kantin** | Kelola menu di Showcase Kantin |
| **Operator ISP** | Generate & kelola penjualan voucher internet |
| **Kepala Sekolah / Superadmin** | Dashboard analitik seluruh modul, approval tingkat tinggi, kelola role |

*(Guru BK, Wali Kelas, dan Pembina Ekskul bisa berupa flag tambahan pada akun Guru — tidak perlu akun terpisah.)*

---

## 3. Modul & Fitur

### 3.1 Modul Inti

**1. Absensi Digital (Siswa)**
- Absen masuk/pulang via QR code (di-generate ulang tiap hari biar nggak bisa difoto & disebar) atau kartu NFC/RFID
- Absen per jam pelajaran (opsional, nyambung ke jadwal Mata Pelajaran), bukan cuma harian
- Rekap otomatis harian/bulanan — status hadir/telat/izin/sakit/alpha
- Guru & wali kelas lihat rekap kelas real-time
- *(Fase 2, opsional: notifikasi ke orang tua via WhatsApp Gateway kalau anak belum absen di jam tertentu)*

**2. Absen Guru**
- Absen masuk/pulang guru, terpisah dari absensi siswa
- Opsional: absen per jam mengajar (berguna buat laporan kinerja/BKD ke dinas)
- Rekap kehadiran guru buat Kepala Sekolah

**3. BK & Pelanggaran**
- Input kasus pelanggaran oleh Guru BK/Wali Kelas — kategori (ringan/sedang/berat) & bobot poin
- Riwayat & akumulasi poin pelanggaran per siswa
- Jadwal & catatan sesi konseling
- Generate surat panggilan orang tua otomatis (template)
- Akses riwayat **hanya** buat siswa ybs, wali kelas, guru BK, dan kepsek — guru lain nggak bisa lihat (data sensitif)

**4. Showcase Kantin**
- Katalog menu digital per kantin/stand (foto, harga, deskripsi, kategori)
- Update status "habis"/stok real-time oleh operator kantin
- *(Fase 2, opsional: pre-order & pembayaran QRIS)*

**5. Ekskul**
- Daftar ekskul & pendaftaran online oleh siswa
- Jadwal latihan & absensi ekskul oleh pembina
- Catatan prestasi/piagam per ekskul

**6. Mata Pelajaran**
- Data mapel, kurikulum, & jadwal per kelas
- Guru upload materi (PDF/video/link) & tugas per mapel
- Siswa kumpul tugas (mini-LMS), guru input nilai
- Terhubung ke modul Akademik/E-Rapor di bawah

**7. Project Tracker untuk SMK**
- Board Kanban (To do / In Progress / Review / Done) per proyek/kelompok
- Cocok buat: proyek kelas produktif (RPL & jurusan lain), jurnal harian PKL/Prakerin, proyek Tugas Akhir
- Submission (link GitHub/demo/file), feedback & penilaian dari guru pembimbing
- Milestone & deadline tracking

**8. Inventaris**
- Data aset/barang sekolah (lab, alat praktik, buku) — kategori, kondisi, lokasi
- Sistem peminjaman & pengembalian (checkout/checkin) — siapa pinjam, kapan
- Riwayat maintenance/perbaikan
- Laporan stok buat Petugas Sarpras & Kepsek

**9. ISP — Jual Voucher**
- Generate voucher hotspot sekolah (kode unik, durasi/kuota, harga)
- Siswa/guru beli voucher (saldo internal atau QRIS), riwayat transaksi
- Integrasi opsional ke Mikrotik User Manager/RADIUS buat aktivasi otomatis
- Laporan penjualan buat Operator ISP

### 3.2 Modul Tambahan yang Disarankan

| Modul | Kenapa Ditambahkan |
|---|---|
| **Auth & Manajemen Role terpusat** | Satu login (SSO) buat semua modul — wajib ada di superapp |
| **Dashboard & Notifikasi terpusat** | Titik kumpul info per role, push notification pengumuman |
| **Perizinan Siswa** | Izin sakit/keluar dengan approval wali kelas — melengkapi Absensi |
| **Akademik / E-Rapor** | Nilai akhir per semester, nyambung ke modul Mata Pelajaran |
| **Kalender Akademik & Pengumuman** | Agenda sekolah, libur, jadwal ujian — dipakai semua role |
| **Prestasi Siswa** | Rekam jejak prestasi akademik & non-akademik (ekskul, lomba) |
| **Surat-Menyurat Digital (TU)** | Persuratan & disposisi internal staff |
| *(Opsional, sensitif) Keuangan/SPP* | Umum ada di superapp sekolah, tapi butuh keamanan ekstra — pertimbangkan jadi modul/fase terpisah |

---

## 4. Matriks Akses per Modul

✅ Kelola penuh 👁️ Lihat saja ⚙️ Approve/khusus ➖ Tidak ada akses

| Modul | Siswa | Guru | BK/Wali Kelas | Staff/TU | Admin/Kepsek |
|---|---|---|---|---|---|
| Absensi Digital | 👁️ (diri sendiri) | ✅ (input) | 👁️ (rekap kelas) | 👁️ | 👁️ |
| Absen Guru | ➖ | 👁️ (diri sendiri) | ➖ | 👁️ | ✅ |
| BK & Pelanggaran | 👁️ (diri sendiri) | ➖ | ✅ | ➖ | 👁️ |
| Showcase Kantin | 👁️ | 👁️ | 👁️ | ✅ (operator) | 👁️ |
| Ekskul | ✅ (daftar) | ✅ (pembina) | 👁️ | 👁️ | 👁️ |
| Mata Pelajaran | 👁️ + kumpul tugas | ✅ | 👁️ | 👁️ | 👁️ |
| Project Tracker | ✅ (proyek sendiri) | ⚙️ (review) | ➖ | ➖ | 👁️ |
| Inventaris | ⚙️ (ajukan pinjam) | ⚙️ (ajukan pinjam) | ➖ | ✅ (sarpras) | 👁️ |
| ISP Voucher | ✅ (beli) | ✅ (beli) | ➖ | ➖ | ✅ (operator) |

*Guru BK & Wali Kelas otomatis mewarisi akses standar Guru (mengajar, input absen, dst) — kolom di atas cuma nunjukin akses TAMBAHAN yang mereka punya di luar itu.*

---

## 5. Spesifikasi Teknis

### Backend — NestJS
- **Bahasa**: TypeScript
- **ORM**: Prisma (migration & type-safety lebih enak dibanding TypeORM)
- **Database**: PostgreSQL
- **Auth**: JWT (access + refresh token) via Passport.js, role-based access lewat custom `@Roles()` decorator + `RolesGuard`
- **Validasi**: `class-validator` + `class-transformer`, pola DTO di tiap endpoint
- **Dokumentasi API**: Swagger (`@nestjs/swagger`) — otomatis ke-generate dari DTO
- **Realtime**: Socket.IO (`@nestjs/websockets`) buat notifikasi live (approval izin, absen masuk, dst)
- **Upload file**: Multer, simpan ke storage S3-compatible (MinIO cocok kalau self-host)
- **Modul per fitur**: `AuthModule`, `UserModule`, `AttendanceModule`, `TeacherAttendanceModule`, `DisciplineModule`, `CanteenModule`, `ExtracurricularModule`, `SubjectModule`, `ProjectTrackerModule`, `InventoryModule`, `VoucherModule`, `NotificationModule`

> Karena background kamu di Laravel: konsep Module–Controller–Service di NestJS mirip Controller–Service di Laravel, bedanya NestJS lebih ketat soal Dependency Injection dan semuanya class-based pakai decorator.

### Frontend — Next.js
- **Router**: App Router, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui — desain minimalis, biru pastel & gradasi lembut, tipografi bersih
- **State server**: TanStack Query (React Query) buat data fetching + caching
- **State client**: Zustand (ringan, cocok buat auth state & UI state)
- **Form**: React Hook Form + Zod (validasinya bisa selaras sama DTO backend)
- **Proteksi route**: `middleware.ts` cek role dari token, redirect kalau akses modul yang bukan haknya
- Layout beda per role (siswa: mobile-first bottom-nav; staff/guru: sidebar desktop)

> Karena kamu juga biasa pakai React Native/Expo: modul Absensi (paling sering diakses lewat HP, butuh scan QR) kandidat kuat buat jadi companion app mobile di fase berikutnya. Untuk versi awal, pastikan Next.js-nya PWA-friendly (`next-pwa`) biar nyaman diakses dari browser HP tanpa install app store dulu.

### Database — Entitas Utama (garis besar)
`User`, `Role`, `Student`, `Teacher`, `Staff`, `Class`, `Major`, `Subject`, `Schedule`, `Attendance`, `TeacherAttendance`, `DisciplineCase`, `ViolationPoint`, `CounselingSession`, `Extracurricular`, `ExtracurricularMember`, `CanteenMenu`, `Project`, `ProjectTask`, `ProjectSubmission`, `InventoryItem`, `BorrowingRecord`, `Voucher`, `VoucherTransaction`

### Arsitektur Proyek
Disarankan **monorepo** pakai Turborepo:
```
superapp-smkn1garut/
├── apps/
│   ├── api/          # NestJS
│   └── web/           # Next.js
├── packages/
│   ├── types/         # DTO/type yang di-share backend ↔ frontend
│   └── ui/            # (opsional) shared component
└── docker-compose.yml
```

---

## 6. Rencana Deployment

Disesuaikan sama tools yang udah kamu kuasai:

- **Backend + PostgreSQL**: containerize pakai Docker, deploy ke VM dari **DigitalOcean** (pakai kredit GitHub Student Pack) atau **Oracle Cloud Free Tier** (VM ARM gratis selamanya) — kelola container-nya pakai **Portainer** seperti biasa
- **Frontend**: tetap di **Vercel** (paling gampang buat Next.js, auto-deploy dari Git)
- **Expose backend dengan aman**: kalau mau self-host penuh (misal server fisik di sekolah buat modul ISP/Voucher yang butuh akses ke jaringan lokal Mikrotik), pakai **Cloudflare Tunnel** biar nggak perlu buka port router
- **Domain**: cek jatah domain gratis dari GitHub Student Pack

---

## 7. Non-Functional Requirements

- **Keamanan data**: data siswa (sebagian di bawah umur) & data BK/pelanggaran termasuk sensitif — terapkan least-privilege access (sesuai matriks di atas), audit log siapa mengubah data apa, dan perhatikan prinsip UU PDP soal data anak
- **Skalabilitas**: pagination di semua list endpoint, caching (Redis) buat data yang sering diakses tapi jarang berubah (jadwal, daftar mapel)
- **Reliabilitas jaringan**: buat absensi, pertimbangkan cache lokal di client kalau koneksi lambat, lalu sync begitu online lagi
- **Auditability**: log perubahan di modul Inventaris — mirip yang pernah kamu bangun di proyek Asset Management PSAT dulu, sekarang tinggal upgrade ke role-based access & histori peminjaman yang lebih lengkap

---

## 8. 🚀 Prompt Siap Pakai

Tinggal copy-paste blok di bawah ini ke Claude Code / Cursor / AI coding assistant lain buat mulai scaffolding:

```
Kamu adalah senior full-stack engineer yang ahli NestJS dan Next.js. Bangun "Superapp SMKN 1 Garut" — platform terpadu untuk siswa, guru, dan staff sekolah kejuruan (SMK).

ARSITEKTUR
- Monorepo Turborepo: apps/api (NestJS + Prisma + PostgreSQL) dan apps/web (Next.js App Router + TypeScript)
- Auth: JWT access+refresh token, RBAC berbasis role (siswa, guru, guru_bk, wali_kelas, pembina_ekskul, staff_tu, petugas_sarpras, operator_kantin, operator_isp, admin, kepsek)

MODUL YANG HARUS DIBUAT (tiap modul = 1 NestJS module + halaman Next.js sesuai role)
1. Absensi Digital — absen siswa via QR code harian, rekap per kelas
2. Absen Guru — absen masuk/pulang guru, terpisah dari siswa
3. BK & Pelanggaran — kasus pelanggaran, poin, sesi konseling, akses terbatas (guru_bk, wali_kelas, admin saja)
4. Showcase Kantin — katalog menu digital, CRUD oleh operator_kantin
5. Ekskul — pendaftaran, jadwal, absensi ekskul, prestasi
6. Mata Pelajaran — CRUD mapel & jadwal, upload materi, kumpul tugas, input nilai
7. Project Tracker — board Kanban per proyek/kelompok, submission, feedback pembimbing, cocok juga buat jurnal PKL
8. Inventaris — data aset, sistem peminjaman/pengembalian, riwayat maintenance
9. ISP Jual Voucher — generate & jual voucher hotspot, riwayat transaksi

STACK TEKNIS
Backend: NestJS, TypeScript, Prisma ORM, PostgreSQL, class-validator, Swagger, Socket.IO untuk notifikasi realtime, Multer untuk upload file
Frontend: Next.js App Router, TypeScript, Tailwind CSS + shadcn/ui (tema minimalis biru pastel & gradasi lembut), TanStack Query, Zustand, React Hook Form + Zod, middleware.ts untuk proteksi route berbasis role

OUTPUT YANG DIHARAPKAN
1. Struktur folder monorepo lengkap
2. schema.prisma lengkap dengan semua entitas (User, Role, Student, Teacher, Staff, Class, Subject, Schedule, Attendance, TeacherAttendance, DisciplineCase, ViolationPoint, CounselingSession, Extracurricular, CanteenMenu, Project, ProjectTask, InventoryItem, BorrowingRecord, Voucher, VoucherTransaction, dst)
3. Seluruh NestJS module (controller + service + DTO + guard role-based) untuk 9 modul di atas
4. Halaman Next.js per role dengan layout berbeda (siswa: mobile-first bottom-nav; staff/guru: sidebar desktop)
5. docker-compose.yml untuk local dev (postgres + api + web)
6. README.md berisi instruksi setup & seed data dummy

Mulai dari struktur folder monorepo dan schema.prisma dulu, baru lanjut module demi module.
```