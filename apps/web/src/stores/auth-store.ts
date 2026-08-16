import { create } from "zustand";
import { UserRole, UserProfile } from "@superapp/types";

// Predefined Demo Profiles for quick-switch testing in development
export const DEMO_ACCOUNTS: Record<
  UserRole,
  { name: string; email: string; title: string; subtitle: string; profile: UserProfile }
> = {
  [UserRole.SISWA]: {
    name: "Ahmad Fauzi",
    email: "siswa@smkn1garut.sch.id",
    title: "Siswa",
    subtitle: "XII RPL 1 · NISN 0071234567",
    profile: {
      id: "demo-siswa-1",
      email: "siswa@smkn1garut.sch.id",
      username: "siswa",
      name: "Ahmad Fauzi",
      role: UserRole.SISWA,
      phone: "085712345678",
      student: {
        id: "stu-1",
        nisn: "0071234567",
        nis: "23241001",
        classId: "class-rpl1",
        className: "XII RPL 1",
        majorName: "Rekayasa Perangkat Lunak",
        gender: "L",
        parentName: "Bapak Rudi Hartono",
        totalViolationPoints: 10,
      },
    },
  },
  [UserRole.GURU]: {
    name: "Budi Santoso, S.Kom",
    email: "guru@smkn1garut.sch.id",
    title: "Guru Mapel",
    subtitle: "Pemrograman Web & Mobile",
    profile: {
      id: "demo-guru-1",
      email: "guru@smkn1garut.sch.id",
      username: "guru",
      name: "Budi Santoso, S.Kom",
      role: UserRole.GURU,
      teacher: {
        id: "teach-1",
        nip: "198501012010011001",
        specialization: "Pemrograman Web & Mobile",
      },
    },
  },
  [UserRole.GURU_BK]: {
    name: "Siti Rahmawati, S.Pd",
    email: "gurubk@smkn1garut.sch.id",
    title: "Guru BK",
    subtitle: "Bimbingan & Konseling Siswa",
    profile: {
      id: "demo-gurubk-1",
      email: "gurubk@smkn1garut.sch.id",
      username: "gurubk",
      name: "Siti Rahmawati, S.Pd",
      role: UserRole.GURU_BK,
      teacher: {
        id: "teach-2",
        nip: "198703152011012002",
        isGuruBK: true,
        specialization: "Bimbingan Konseling",
      },
    },
  },
  [UserRole.WALI_KELAS]: {
    name: "Dedi Supriadi, M.T",
    email: "walikelas@smkn1garut.sch.id",
    title: "Wali Kelas",
    subtitle: "Wali Kelas XII RPL 1",
    profile: {
      id: "demo-walikelas-1",
      email: "walikelas@smkn1garut.sch.id",
      username: "walikelas",
      name: "Dedi Supriadi, M.T",
      role: UserRole.WALI_KELAS,
      teacher: {
        id: "teach-3",
        nip: "198207202008011003",
        isWaliKelas: true,
        homeroomClassId: "class-rpl1",
        homeroomClassName: "XII RPL 1",
      },
    },
  },
  [UserRole.PEMBINA_EKSKUL]: {
    name: "Hendrik Kurniawan, S.Pd",
    email: "pembina@smkn1garut.sch.id",
    title: "Pembina Ekskul",
    subtitle: "Pembina Robotic & IoT Club",
    profile: {
      id: "demo-pembina-1",
      email: "pembina@smkn1garut.sch.id",
      username: "pembina",
      name: "Hendrik Kurniawan, S.Pd",
      role: UserRole.PEMBINA_EKSKUL,
      teacher: {
        id: "teach-4",
        isPembinaEkskul: true,
      },
    },
  },
  [UserRole.STAFF_TU]: {
    name: "Dewi Lestari, S.AP",
    email: "stafftu@smkn1garut.sch.id",
    title: "Staff TU",
    subtitle: "Tata Usaha & Kesiswaan",
    profile: {
      id: "demo-stafftu-1",
      email: "stafftu@smkn1garut.sch.id",
      username: "stafftu",
      name: "Dewi Lestari, S.AP",
      role: UserRole.STAFF_TU,
      staff: {
        id: "staff-1",
        department: "Tata Usaha",
      },
    },
  },
  [UserRole.PETUGAS_SARPRAS]: {
    name: "Asep Solihin",
    email: "sarpras@smkn1garut.sch.id",
    title: "Petugas Sarpras",
    subtitle: "Pengelola Aset & Inventaris",
    profile: {
      id: "demo-sarpras-1",
      email: "sarpras@smkn1garut.sch.id",
      username: "sarpras",
      name: "Asep Solihin",
      role: UserRole.PETUGAS_SARPRAS,
      staff: {
        id: "staff-2",
        department: "Sarana dan Prasarana",
      },
    },
  },
  [UserRole.OPERATOR_KANTIN]: {
    name: "Ibu Eni Rohaeni",
    email: "kantin@smkn1garut.sch.id",
    title: "Operator Kantin",
    subtitle: "Stand Kantin 01 (Barokah)",
    profile: {
      id: "demo-kantin-1",
      email: "kantin@smkn1garut.sch.id",
      username: "kantin",
      name: "Ibu Eni Rohaeni",
      role: UserRole.OPERATOR_KANTIN,
    },
  },
  [UserRole.OPERATOR_ISP]: {
    name: "Rian Hidayat",
    email: "isp@smkn1garut.sch.id",
    title: "Operator ISP",
    subtitle: "Pengelola Hotspot Voucher",
    profile: {
      id: "demo-isp-1",
      email: "isp@smkn1garut.sch.id",
      username: "isp",
      name: "Rian Hidayat",
      role: UserRole.OPERATOR_ISP,
    },
  },
  [UserRole.ADMIN]: {
    name: "Super Admin",
    email: "admin@smkn1garut.sch.id",
    title: "Administrator",
    subtitle: "Pengelola Sistem Utama",
    profile: {
      id: "demo-admin-1",
      email: "admin@smkn1garut.sch.id",
      username: "admin",
      name: "Super Admin SMKN 1 Garut",
      role: UserRole.ADMIN,
    },
  },
  [UserRole.KEPSEK]: {
    name: "Dr. H. Dadang Johar Arifin, M.M",
    email: "kepsek@smkn1garut.sch.id",
    title: "Kepala Sekolah",
    subtitle: "Pimpinan SMKN 1 Garut",
    profile: {
      id: "demo-kepsek-1",
      email: "kepsek@smkn1garut.sch.id",
      username: "kepsek",
      name: "Dr. H. Dadang Johar Arifin, M.M",
      role: UserRole.KEPSEK,
    },
  },
};

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: UserProfile, token: string) => void;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: DEMO_ACCOUNTS[UserRole.SISWA].profile,
  token: "demo-jwt-token-active",
  isAuthenticated: true,

  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
    if (typeof window !== "undefined") {
      localStorage.setItem("superapp_token", token);
      localStorage.setItem("superapp_user", JSON.stringify(user));
    }
  },

  switchRole: (role: UserRole) => {
    const demo = DEMO_ACCOUNTS[role];
    if (demo) {
      set({
        user: demo.profile,
        token: `demo-jwt-token-${role.toLowerCase()}`,
        isAuthenticated: true,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("superapp_role", role);
      }
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    if (typeof window !== "undefined") {
      localStorage.removeItem("superapp_token");
      localStorage.removeItem("superapp_user");
    }
  },
}));
