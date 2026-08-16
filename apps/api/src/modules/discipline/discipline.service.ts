import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDisciplineCaseDto, CreateCounselingSessionDto } from './dto/create-case.dto';
import { DisciplineCaseStatus, Role } from '@prisma/client';

@Injectable()
export class DisciplineService {
  constructor(private prisma: PrismaService) {}

  async createCase(reporterId: string, dto: CreateDisciplineCaseDto) {
    const student = await this.prisma.student.findUnique({
      where: { id: dto.studentId },
    });

    if (!student) {
      throw new NotFoundException('Data siswa tidak ditemukan');
    }

    const createdCase = await this.prisma.disciplineCase.create({
      data: {
        studentId: dto.studentId,
        reportedById: reporterId,
        category: dto.category,
        title: dto.title,
        description: dto.description,
        points: dto.points,
        needsParentSummons: dto.needsParentSummons || false,
        parentSummonsDate: dto.parentSummonsDate ? new Date(dto.parentSummonsDate) : null,
        status: dto.needsParentSummons
          ? DisciplineCaseStatus.PANGGILAN_ORANG_TUA
          : DisciplineCaseStatus.DIPROSES,
      },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        reportedBy: true,
      },
    });

    // Update accumulated violation points for student
    await this.prisma.student.update({
      where: { id: dto.studentId },
      data: {
        totalViolationPoints: {
          increment: dto.points,
        },
      },
    });

    return createdCase;
  }

  async getAllCases(studentId?: string) {
    return this.prisma.disciplineCase.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
        reportedBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
        counselingSessions: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async getMyDisciplinaryRecord(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: {
        class: true,
      },
    });

    if (!student) {
      throw new BadRequestException('Bukan akun siswa');
    }

    const cases = await this.prisma.disciplineCase.findMany({
      where: { studentId: student.id },
      include: {
        reportedBy: {
          select: { name: true, role: true },
        },
        counselingSessions: true,
      },
      orderBy: { date: 'desc' },
    });

    const counselingSessions = await this.prisma.counselingSession.findMany({
      where: { studentId: student.id },
      include: {
        counselor: { select: { name: true } },
      },
      orderBy: { sessionDate: 'desc' },
    });

    return {
      studentInfo: {
        totalPoints: student.totalViolationPoints,
        class: student.class.name,
      },
      cases,
      counselingSessions,
    };
  }

  async createCounselingSession(counselorId: string, dto: CreateCounselingSessionDto) {
    return this.prisma.counselingSession.create({
      data: {
        studentId: dto.studentId,
        counselorId,
        caseId: dto.caseId,
        sessionDate: new Date(dto.sessionDate),
        notes: dto.notes,
        followUpPlan: dto.followUpPlan,
      },
      include: {
        student: {
          include: { user: true, class: true },
        },
        counselor: {
          select: { name: true },
        },
      },
    });
  }

  async getAllCounselingSessions() {
    return this.prisma.counselingSession.findMany({
      include: {
        student: {
          include: { user: true, class: true },
        },
        counselor: {
          select: { name: true },
        },
        case: true,
      },
      orderBy: { sessionDate: 'desc' },
    });
  }

  async generateParentSummonsLetter(caseId: string) {
    const discCase = await this.prisma.disciplineCase.findUnique({
      where: { id: caseId },
      include: {
        student: {
          include: { user: true, class: true },
        },
        reportedBy: true,
      },
    });

    if (!discCase) {
      throw new NotFoundException('Kasus pelanggaran tidak ditemukan');
    }

    return {
      letterNumber: `421.5/BK-SMK1/${new Date().getFullYear()}/${discCase.id.substring(0, 6).toUpperCase()}`,
      schoolName: 'SMK NEGERI 1 GARUT',
      schoolAddress: 'Jl. Cimanuk No. 309A, Tarogong Kidul, Garut 44151',
      date: new Date().toISOString(),
      studentName: discCase.student.user.name,
      nisn: discCase.student.nisn,
      className: discCase.student.class.name,
      parentName: discCase.student.parentName || 'Orang Tua / Wali Siswa',
      violationTitle: discCase.title,
      violationCategory: discCase.category,
      accumulatedPoints: discCase.student.totalViolationPoints,
      summonsSchedule: discCase.parentSummonsDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      counselorName: 'Siti Rahmawati, S.Pd (Guru BK)',
      headmasterName: 'Dr. H. Dadang Johar Arifin, M.M',
    };
  }
}
