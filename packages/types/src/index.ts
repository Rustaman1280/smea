// ==========================================
// ROLE & USER TYPES
// ==========================================

export enum UserRole {
  SISWA = 'SISWA',
  GURU = 'GURU',
  GURU_BK = 'GURU_BK',
  WALI_KELAS = 'WALI_KELAS',
  PEMBINA_EKSKUL = 'PEMBINA_EKSKUL',
  STAFF_TU = 'STAFF_TU',
  PETUGAS_SARPRAS = 'PETUGAS_SARPRAS',
  OPERATOR_KANTIN = 'OPERATOR_KANTIN',
  OPERATOR_ISP = 'OPERATOR_ISP',
  ADMIN = 'ADMIN',
  KEPSEK = 'KEPSEK',
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  username: string;
  role: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  studentId?: string | null;
  teacherId?: string | null;
  staffId?: string | null;
  student?: StudentInfo;
  teacher?: TeacherInfo;
  staff?: StaffInfo;
}

export interface StudentInfo {
  id: string;
  nisn: string;
  nis: string;
  classId: string;
  className?: string;
  majorName?: string;
  gender: 'L' | 'P';
  parentPhone?: string | null;
  parentName?: string | null;
  totalViolationPoints?: number;
}

export interface TeacherInfo {
  id: string;
  nip?: string | null;
  nuptk?: string | null;
  specialization?: string | null;
  isWaliKelas?: boolean;
  isGuruBK?: boolean;
  isPembinaEkskul?: boolean;
  homeroomClassId?: string | null;
  homeroomClassName?: string | null;
}

export interface StaffInfo {
  id: string;
  nip?: string | null;
  department: string;
}

// ==========================================
// 1. ABSENSI DIGITAL SISWA
// ==========================================

export enum AttendanceStatus {
  HADIR = 'HADIR',
  TERLAMBAT = 'TERLAMBAT',
  IZIN = 'IZIN',
  SAKIT = 'SAKIT',
  ALPHA = 'ALPHA',
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName?: string;
  nisn?: string;
  className?: string;
  date: string;
  timeIn?: string | null;
  timeOut?: string | null;
  status: AttendanceStatus;
  notes?: string | null;
  method: 'QR_CODE' | 'NFC' | 'MANUAL';
  verifiedBy?: string | null;
}

export interface AttendanceQRToken {
  token: string;
  expiresAt: string;
  date: string;
  session: 'PAGI' | 'SORE';
}

// ==========================================
// 2. ABSEN GURU & BKD
// ==========================================

export interface TeacherAttendanceRecord {
  id: string;
  teacherId: string;
  teacherName?: string;
  nip?: string | null;
  date: string;
  timeIn?: string | null;
  timeOut?: string | null;
  status: 'HADIR' | 'IZIN' | 'SAKIT' | 'DINAS_LUAR' | 'ALPHA';
  latitude?: number | null;
  longitude?: number | null;
  photoUrl?: string | null;
  notes?: string | null;
  teachingSessions?: TeachingSessionRecord[];
}

export interface TeachingSessionRecord {
  id: string;
  teacherAttendanceId: string;
  subjectName: string;
  className: string;
  startPeriod: number;
  endPeriod: number;
  topicTaught: string;
  studentAttendanceCount: number;
}

// ==========================================
// 3. BK & PELANGGARAN
// ==========================================

export enum ViolationSeverity {
  RINGAN = 'RINGAN',
  SEDANG = 'SEDANG',
  BERAT = 'BERAT',
}

export interface DisciplineCase {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  className: string;
  category: ViolationSeverity;
  title: string;
  description: string;
  points: number;
  reportedBy: string;
  reporterName: string;
  date: string;
  status: 'DIPROSES' | 'SELESAI' | 'PANGGILAN_ORANG_TUA';
  counselingNotes?: string | null;
  needsParentSummons: boolean;
  parentSummonsDate?: string | null;
}

export interface CounselingSession {
  id: string;
  studentId: string;
  studentName: string;
  counselorId: string;
  counselorName: string;
  caseId?: string | null;
  sessionDate: string;
  notes: string;
  followUpPlan: string;
  status: 'TERJADWAL' | 'SELESAI' | 'BATAL';
}

// ==========================================
// 4. SHOWCASE KANTIN
// ==========================================

export enum CanteenCategory {
  MAKANAN_BERAT = 'MAKANAN_BERAT',
  SNACK = 'SNACK',
  MINUMAN = 'MINUMAN',
  DESSERT = 'DESSERT',
}

export interface CanteenStand {
  id: string;
  name: string;
  standNumber: string;
  ownerName: string;
  phone?: string | null;
  isOpen: boolean;
}

export interface CanteenMenuItem {
  id: string;
  standId: string;
  standName?: string;
  name: string;
  description?: string | null;
  price: number;
  category: CanteenCategory;
  imageUrl?: string | null;
  isAvailable: boolean;
  stock?: number;
}

// ==========================================
// 5. EKSTRAKURIKULER
// ==========================================

export interface ExtracurricularClub {
  id: string;
  name: string;
  description: string;
  category: 'OLAHRAGA' | 'SENI' | 'TEKNOLOGI' | 'KEAGAMAAN' | 'KEPANDUAN' | 'BAHASA';
  coachName: string;
  pembinaId?: string | null;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  imageUrl?: string | null;
  memberCount?: number;
  isRecruiting: boolean;
}

export interface ExtracurricularMember {
  id: string;
  clubId: string;
  clubName?: string;
  studentId: string;
  studentName: string;
  className: string;
  joinedAt: string;
  role: 'ANGGOTA' | 'KETUA' | 'WAKIL' | 'SEKRETARIS' | 'BENDAHARA';
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
}

export interface ExtracurricularAchievement {
  id: string;
  clubId: string;
  title: string;
  competition: string;
  level: 'KABUPATEN' | 'PROVINSI' | 'NASIONAL' | 'INTERNASIONAL';
  rank: string;
  year: number;
  certificateUrl?: string | null;
}

// ==========================================
// 6. MATA PELAJARAN & LMS
// ==========================================

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  gradeLevel: number;
  majorName?: string | null;
}

export interface ClassSchedule {
  id: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  teacherId: string;
  teacherName: string;
  dayOfWeek: number; // 1 = Monday ... 6 = Saturday
  startTime: string;
  endTime: string;
  room: string;
}

export interface LearningMaterial {
  id: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  title: string;
  description?: string | null;
  fileUrl?: string | null;
  linkUrl?: string | null;
  uploadedAt: string;
  teacherName: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  subjectName: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  deadline: string;
  maxScore: number;
  totalSubmissions?: number;
  gradedCount?: number;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submissionUrl?: string | null;
  notes?: string | null;
  submittedAt: string;
  score?: number | null;
  feedback?: string | null;
  gradedAt?: string | null;
}

// ==========================================
// 7. PROJECT TRACKER & JURNAL PKL
// ==========================================

export enum TaskColumn {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export interface VocationalProject {
  id: string;
  title: string;
  description: string;
  type: 'PROYEK_PRODUKTIF' | 'JURNAL_PKL' | 'TUGAS_AKHIR';
  major: string;
  classId: string;
  className: string;
  leaderId: string;
  leaderName: string;
  supervisorId: string;
  supervisorName: string;
  githubUrl?: string | null;
  demoUrl?: string | null;
  score?: number | null;
  feedback?: string | null;
  status: 'PLANNING' | 'ACTIVE' | 'SUBMITTED' | 'APPROVED' | 'REVISION';
  deadline: string;
  tasks?: ProjectTaskItem[];
}

export interface ProjectTaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  assigneeName?: string | null;
  column: TaskColumn;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string | null;
}

export interface PklJournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  companyName: string;
  date: string;
  activityDescription: string;
  competencyLearned: string;
  photoUrl?: string | null;
  verifiedBySupervisor: boolean;
  supervisorNotes?: string | null;
}

// ==========================================
// 8. INVENTARIS SARPRAS
// ==========================================

export enum ItemCondition {
  BAIK = 'BAIK',
  RUSAK_RINGAN = 'RUSAK_RINGAN',
  RUSAK_BERAT = 'RUSAK_BERAT',
  DALAM_PERBAIKAN = 'DALAM_PERBAIKAN',
}

export enum BorrowStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'ALAT_LAB_RPL' | 'ALAT_LAB_TKJ' | 'ALAT_OTOMOTIF' | 'ALAT_ELEKTRONIKA' | 'MEDIA_PEMBELAJARAN' | 'UMUM';
  location: string;
  quantityTotal: number;
  quantityAvailable: number;
  condition: ItemCondition;
  purchaseDate?: string | null;
  notes?: string | null;
}

export interface BorrowingRecord {
  id: string;
  itemId: string;
  itemName: string;
  itemCode: string;
  borrowerId: string;
  borrowerName: string;
  borrowerRole: UserRole;
  quantity: number;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string | null;
  status: BorrowStatus;
  purpose: string;
  approvedBy?: string | null;
  notes?: string | null;
}

export interface MaintenanceLog {
  id: string;
  itemId: string;
  itemName: string;
  reportedDate: string;
  issueDescription: string;
  actionTaken?: string | null;
  cost?: number | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedDate?: string | null;
}

// ==========================================
// 9. ISP VOUCHER HOTSPOT
// ==========================================

export enum VoucherStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
}

export interface HotspotVoucher {
  id: string;
  code: string;
  profileName: string; // e.g. "3 Jam - 1GB", "1 Hari - Unlimited", "1 Bulan"
  durationHours: number;
  quotaMb?: number | null;
  price: number;
  status: VoucherStatus;
  buyerId?: string | null;
  buyerName?: string | null;
  purchasedAt?: string | null;
  expiresAt?: string | null;
  batchNumber: string;
}

export interface VoucherTransaction {
  id: string;
  voucherId: string;
  voucherCode: string;
  profileName: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  amount: number;
  paymentMethod: 'SALDO_INTERNAL' | 'QRIS' | 'CASH';
  transactionDate: string;
}

// ==========================================
// NOTIFICATIONS
// ==========================================

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ALERT';
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}
