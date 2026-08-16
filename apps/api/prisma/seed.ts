import { PrismaClient, Role, AttendanceStatus, AttendanceMethod, ViolationSeverity, DisciplineCaseStatus, CanteenCategory, ExtracurricularCategory, ProjectType, ProjectStatus, TaskColumn, TaskPriority, ItemCondition, ItemCategory, BorrowStatus, VoucherStatus, PaymentMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai seeding data Superapp SMKN 1 Garut...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. MAJORS
  const rpl = await prisma.major.upsert({
    where: { code: 'RPL' },
    update: {},
    create: {
      code: 'RPL',
      name: 'Rekayasa Perangkat Lunak',
      description: 'Pengembangan Perangkat Lunak dan Gim',
    },
  });

  const tkj = await prisma.major.upsert({
    where: { code: 'TKJ' },
    update: {},
    create: {
      code: 'TKJ',
      name: 'Teknik Komputer dan Jaringan',
      description: 'Infrastruktur Jaringan dan Cyber Security',
    },
  });

  // 2. USERS & PROFILES
  // 2.1 Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'admin@smkn1garut.sch.id',
      username: 'admin',
      name: 'Super Admin SMKN 1 Garut',
      password: passwordHash,
      role: Role.ADMIN,
      phone: '081234567890',
    },
  });

  // 2.2 Kepala Sekolah
  const kepsekUser = await prisma.user.upsert({
    where: { email: 'kepsek@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'kepsek@smkn1garut.sch.id',
      username: 'kepsek',
      name: 'Dr. H. Dadang Johar Arifin, M.M',
      password: passwordHash,
      role: Role.KEPSEK,
      phone: '081234567891',
    },
  });

  // 2.3 Guru Mapel
  const guruUser = await prisma.user.upsert({
    where: { email: 'guru@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'guru@smkn1garut.sch.id',
      username: 'guru',
      name: 'Budi Santoso, S.Kom',
      password: passwordHash,
      role: Role.GURU,
      phone: '081234567892',
      teacher: {
        create: {
          nip: '198501012010011001',
          nuptk: '84920192849201',
          specialization: 'Pemrograman Web & Mobile',
        },
      },
    },
    include: { teacher: true },
  });

  // 2.4 Guru BK
  const guruBkUser = await prisma.user.upsert({
    where: { email: 'gurubk@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'gurubk@smkn1garut.sch.id',
      username: 'gurubk',
      name: 'Siti Rahmawati, S.Pd',
      password: passwordHash,
      role: Role.GURU_BK,
      phone: '081234567893',
      teacher: {
        create: {
          nip: '198703152011012002',
          isGuruBK: true,
          specialization: 'Bimbingan Konseling',
        },
      },
    },
    include: { teacher: true },
  });

  // 2.5 Wali Kelas
  const waliKelasUser = await prisma.user.upsert({
    where: { email: 'walikelas@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'walikelas@smkn1garut.sch.id',
      username: 'walikelas',
      name: 'Dedi Supriadi, M.T',
      password: passwordHash,
      role: Role.WALI_KELAS,
      phone: '081234567894',
      teacher: {
        create: {
          nip: '198207202008011003',
          isWaliKelas: true,
          specialization: 'Basis Data & Cloud',
        },
      },
    },
    include: { teacher: true },
  });

  // 2.6 Pembina Ekskul
  const pembinaUser = await prisma.user.upsert({
    where: { email: 'pembina@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'pembina@smkn1garut.sch.id',
      username: 'pembina',
      name: 'Hendrik Kurniawan, S.Pd',
      password: passwordHash,
      role: Role.PEMBINA_EKSKUL,
      phone: '081234567895',
      teacher: {
        create: {
          nip: '199011122015021004',
          isPembinaEkskul: true,
          specialization: 'Robotika & IoT',
        },
      },
    },
    include: { teacher: true },
  });

  // 2.7 Staff TU
  const staffTuUser = await prisma.user.upsert({
    where: { email: 'stafftu@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'stafftu@smkn1garut.sch.id',
      username: 'stafftu',
      name: 'Dewi Lestari, S.AP',
      password: passwordHash,
      role: Role.STAFF_TU,
      phone: '081234567896',
      staff: {
        create: {
          nip: '199204012016012005',
          department: 'Tata Usaha & Kesiswaan',
        },
      },
    },
  });

  // 2.8 Petugas Sarpras
  const sarprasUser = await prisma.user.upsert({
    where: { email: 'sarpras@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'sarpras@smkn1garut.sch.id',
      username: 'sarpras',
      name: 'Asep Solihin',
      password: passwordHash,
      role: Role.PETUGAS_SARPRAS,
      phone: '081234567897',
      staff: {
        create: {
          department: 'Sarana dan Prasarana',
        },
      },
    },
  });

  // 2.9 Operator Kantin
  const kantinUser = await prisma.user.upsert({
    where: { email: 'kantin@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'kantin@smkn1garut.sch.id',
      username: 'kantin',
      name: 'Ibu Eni Rohaeni',
      password: passwordHash,
      role: Role.OPERATOR_KANTIN,
      phone: '081234567898',
    },
  });

  // 2.10 Operator ISP
  const ispUser = await prisma.user.upsert({
    where: { email: 'isp@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'isp@smkn1garut.sch.id',
      username: 'isp',
      name: 'Rian Hidayat',
      password: passwordHash,
      role: Role.OPERATOR_ISP,
      phone: '081234567899',
    },
  });

  // 3. CLASS & HOMEROOM
  const classRpl1 = await prisma.class.upsert({
    where: { name: 'XII RPL 1' },
    update: {},
    create: {
      name: 'XII RPL 1',
      grade: 12,
      majorId: rpl.id,
      homeroomTeacherId: waliKelasUser.teacher?.id,
      academicYear: '2025/2026',
    },
  });

  const classTkj1 = await prisma.class.upsert({
    where: { name: 'XII TKJ 1' },
    update: {},
    create: {
      name: 'XII TKJ 1',
      grade: 12,
      majorId: tkj.id,
      academicYear: '2025/2026',
    },
  });

  // 4. SISWA
  const siswaUser = await prisma.user.upsert({
    where: { email: 'siswa@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'siswa@smkn1garut.sch.id',
      username: 'siswa',
      name: 'Ahmad Fauzi',
      password: passwordHash,
      role: Role.SISWA,
      phone: '085712345678',
      student: {
        create: {
          nisn: '0071234567',
          nis: '23241001',
          classId: classRpl1.id,
          gender: 'L',
          parentName: 'Bapak Rudi Hartono',
          parentPhone: '081399887766',
          address: 'Jl. Cimanuk No. 45 Garut',
          totalViolationPoints: 10,
        },
      },
    },
    include: { student: true },
  });

  const siswaUser2 = await prisma.user.upsert({
    where: { email: 'siswa2@smkn1garut.sch.id' },
    update: {},
    create: {
      email: 'siswa2@smkn1garut.sch.id',
      username: 'siswa2',
      name: 'Nabila Putri Azzahra',
      password: passwordHash,
      role: Role.SISWA,
      phone: '085712345679',
      student: {
        create: {
          nisn: '0071234568',
          nis: '23241002',
          classId: classRpl1.id,
          gender: 'P',
          parentName: 'Ibu Ratna Dewi',
          parentPhone: '081399887755',
          address: 'Jl. Pramuka No. 12 Garut',
          totalViolationPoints: 0,
        },
      },
    },
    include: { student: true },
  });

  // 5. SUBJECTS & SCHEDULES
  const subjectPwl = await prisma.subject.upsert({
    where: { code: 'PWL-12' },
    update: {},
    create: {
      code: 'PWL-12',
      name: 'Pemrograman Web dan Perangkat Bergerak',
      gradeLevel: 12,
      majorId: rpl.id,
    },
  });

  const subjectDb = await prisma.subject.upsert({
    where: { code: 'BASIS-DATA-12' },
    update: {},
    create: {
      code: 'BASIS-DATA-12',
      name: 'Basis Data & Cloud Backend',
      gradeLevel: 12,
      majorId: rpl.id,
    },
  });

  if (guruUser.teacher) {
    await prisma.schedule.createMany({
      data: [
        {
          subjectId: subjectPwl.id,
          classId: classRpl1.id,
          teacherId: guruUser.teacher.id,
          dayOfWeek: 1, // Senin
          startTime: '07:15',
          endTime: '09:30',
          room: 'Lab Komputer RPL 2',
        },
        {
          subjectId: subjectDb.id,
          classId: classRpl1.id,
          teacherId: guruUser.teacher.id,
          dayOfWeek: 3, // Rabu
          startTime: '09:45',
          endTime: '12:00',
          room: 'Lab Cloud & Server',
        },
      ],
      skipDuplicates: true,
    });
  }

  // 6. QR ABSENSI HARIAN
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.attendanceQR.upsert({
    where: { code: 'QR-SMK1-PAGI-TODAY' },
    update: {},
    create: {
      code: 'QR-SMK1-PAGI-TODAY',
      token: 'smkn1garut-auth-token-' + today.toISOString().split('T')[0],
      date: today,
      session: 'PAGI',
      expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  if (siswaUser.student) {
    await prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: siswaUser.student.id,
          date: today,
        },
      },
      update: {},
      create: {
        studentId: siswaUser.student.id,
        date: today,
        timeIn: new Date(),
        status: AttendanceStatus.HADIR,
        method: AttendanceMethod.QR_CODE,
      },
    });
  }

  // 7. BK & PELANGGARAN
  if (siswaUser.student) {
    const violation = await prisma.disciplineCase.create({
      data: {
        studentId: siswaUser.student.id,
        reportedById: waliKelasUser.id,
        category: ViolationSeverity.RINGAN,
        title: 'Terlambat Masuk Sekolah 3x Berturut-turut',
        description: 'Siswa tiba di sekolah lewat dari pukul 07:15 WIB pada hari Senin, Selasa, dan Kamis.',
        points: 10,
        status: DisciplineCaseStatus.DIPROSES,
        needsParentSummons: false,
      },
    });

    await prisma.counselingSession.create({
      data: {
        studentId: siswaUser.student.id,
        counselorId: guruBkUser.id,
        caseId: violation.id,
        sessionDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        notes: 'Diberikan pengarahan mengenai manajemen waktu dan komitmen kehadiran tepat waktu.',
        followUpPlan: 'Pemantauan absensi selama 2 minggu ke depan.',
      },
    });
  }

  // 8. SHOWCASE KANTIN
  const stand1 = await prisma.canteenStand.upsert({
    where: { standNumber: 'STAND-01' },
    update: {},
    create: {
      name: 'Kantin Barokah Ibu Eni',
      standNumber: 'STAND-01',
      ownerName: 'Ibu Eni Rohaeni',
      phone: '081234567898',
      isOpen: true,
      operatorId: kantinUser.id,
    },
  });

  await prisma.canteenMenu.createMany({
    data: [
      {
        standId: stand1.id,
        name: 'Nasi Ayam Geprek Sambal Korek',
        description: 'Ayam krispi renyah dengan ulekan cabai rawit pedas mantap + lalapan',
        price: 13000,
        category: CanteenCategory.MAKANAN_BERAT,
        isAvailable: true,
        stock: 35,
      },
      {
        standId: stand1.id,
        name: 'Mie Goreng Spesial Telur Kornet',
        description: 'Mie goreng racikan gurih dengan topping telur ceplok dan sosis',
        price: 10000,
        category: CanteenCategory.MAKANAN_BERAT,
        isAvailable: true,
        stock: 25,
      },
      {
        standId: stand1.id,
        name: 'Es Teh Manis Segar Jumbo',
        description: 'Teh melati wangi dengan es batu higienis porsi besar',
        price: 3500,
        category: CanteenCategory.MINUMAN,
        isAvailable: true,
        stock: 100,
      },
      {
        standId: stand1.id,
        name: 'Pisang Nugget Coklat Keju',
        description: 'Nugget pisang renyah berlumur saus coklat lumer & parutan keju',
        price: 8000,
        category: CanteenCategory.SNACK,
        isAvailable: true,
        stock: 20,
      },
    ],
    skipDuplicates: true,
  });

  // 9. EKSTRAKURIKULER
  const roboticClub = await prisma.extracurricular.upsert({
    where: { name: 'SMK 1 Robotic & IoT Club' },
    update: {},
    create: {
      name: 'SMK 1 Robotic & IoT Club',
      description: 'Ekskul riset dan pembuatan robotika, otomasi cerdas berbasis Arduino & ESP32 serta kompetisi LKS.',
      category: ExtracurricularCategory.TEKNOLOGI,
      coachName: 'Hendrik Kurniawan, S.Pd',
      pembinaId: pembinaUser.teacher?.id,
      scheduleDay: 'Kamis',
      scheduleTime: '15:30 - 17:30 WIB',
      location: 'Lab Hardware & IoT SMKN 1 Garut',
      isRecruiting: true,
    },
  });

  if (siswaUser.student) {
    await prisma.extracurricularMember.upsert({
      where: {
        clubId_studentId: {
          clubId: roboticClub.id,
          studentId: siswaUser.student.id,
        },
      },
      update: {},
      create: {
        clubId: roboticClub.id,
        studentId: siswaUser.student.id,
        role: 'ANGGOTA',
        status: 'ACTIVE',
      },
    });
  }

  // 10. PROJECT TRACKER & KANBAN
  const project1 = await prisma.vocationalProject.create({
    data: {
      title: 'Aplikasi Kasir POS Berbasis Web untuk Kantin Sekolah',
      description: 'Proyek akhir kelas XII RPL untuk digitalisasi pemesanan dan cetak struk kantin SMKN 1 Garut.',
      type: ProjectType.PROYEK_PRODUKTIF,
      major: 'RPL',
      classId: classRpl1.id,
      leaderId: siswaUser.id,
      supervisorId: guruUser.id,
      githubUrl: 'https://github.com/smkn1garut/pos-canteen',
      demoUrl: 'https://pos-canteen.smkn1garut.sch.id',
      status: ProjectStatus.ACTIVE,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tasks: {
        create: [
          {
            title: 'Desain ERD & Skema Database Prisma',
            column: TaskColumn.DONE,
            priority: TaskPriority.HIGH,
            assigneeName: 'Ahmad Fauzi',
          },
          {
            title: 'Implementasi API Backend NestJS (CRUD Menu)',
            column: TaskColumn.IN_PROGRESS,
            priority: TaskPriority.HIGH,
            assigneeName: 'Ahmad Fauzi',
          },
          {
            title: 'Slicing UI Kasir Next.js Tailwind & shadcn',
            column: TaskColumn.TODO,
            priority: TaskPriority.MEDIUM,
            assigneeName: 'Nabila Putri Azzahra',
          },
          {
            title: 'Integrasi Cetak Struk Thermal Bluetooth',
            column: TaskColumn.TODO,
            priority: TaskPriority.LOW,
            assigneeName: 'Ahmad Fauzi',
          },
        ],
      },
    },
  });

  // 11. INVENTARIS SARPRAS
  const itemLaptop = await prisma.inventoryItem.upsert({
    where: { code: 'LAB-RPL-001' },
    update: {},
    create: {
      code: 'LAB-RPL-001',
      name: 'Laptop ASUS TUF Gaming A15 (Praktik AI & Game)',
      category: ItemCategory.ALAT_LAB_RPL,
      location: 'Ruang Lab RPL 1 (Lemari A1)',
      quantityTotal: 20,
      quantityAvailable: 18,
      condition: ItemCondition.BAIK,
      purchaseDate: new Date('2024-01-15'),
      notes: 'Spesifikasi: Ryzen 7, RTX 4060, 16GB RAM',
    },
  });

  await prisma.inventoryItem.upsert({
    where: { code: 'PROY-EPS-002' },
    update: {},
    create: {
      code: 'PROY-EPS-002',
      name: 'Proyektor Epson EB-X500 HDMI Portable',
      category: ItemCategory.MEDIA_PEMBELAJARAN,
      location: 'Ruang Sarpras Utama',
      quantityTotal: 10,
      quantityAvailable: 9,
      condition: ItemCondition.BAIK,
      purchaseDate: new Date('2023-08-10'),
    },
  });

  await prisma.borrowingRecord.create({
    data: {
      itemId: itemLaptop.id,
      borrowerId: siswaUser.id,
      quantity: 1,
      expectedReturnDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: BorrowStatus.BORROWED,
      purpose: 'Pengerjaan tugas akhir pembuatan aplikasi mobile di perpustakaan',
      approvedBy: 'Asep Solihin (Sarpras)',
    },
  });

  // 12. ISP VOUCHER HOTSPOT
  const voucherList = [
    { code: 'SMK-1H-A9X2', profileName: '1 Hari - Unlimited 10 Mbps', durationHours: 24, quotaMb: null, price: 3000 },
    { code: 'SMK-1H-B8Y3', profileName: '1 Hari - Unlimited 10 Mbps', durationHours: 24, quotaMb: null, price: 3000 },
    { code: 'SMK-3J-K4P7', profileName: '3 Jam - Kuota 2 GB', durationHours: 3, quotaMb: 2048, price: 1500 },
    { code: 'SMK-3J-L5Q8', profileName: '3 Jam - Kuota 2 GB', durationHours: 3, quotaMb: 2048, price: 1500 },
    { code: 'SMK-7H-M2W9', profileName: '7 Hari - Unlimited 15 Mbps', durationHours: 168, quotaMb: null, price: 15000 },
    { code: 'SMK-30H-V1Z0', profileName: '1 Bulan - Pelajar Prioritas', durationHours: 720, quotaMb: null, price: 45000 },
  ];

  for (const v of voucherList) {
    await prisma.hotspotVoucher.upsert({
      where: { code: v.code },
      update: {},
      create: {
        code: v.code,
        profileName: v.profileName,
        durationHours: v.durationHours,
        quotaMb: v.quotaMb,
        price: v.price,
        status: VoucherStatus.AVAILABLE,
        batchNumber: 'BATCH-2026-08',
      },
    });
  }

  console.log('✅ Seeding data Superapp SMKN 1 Garut berhasil diselesaikan!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
