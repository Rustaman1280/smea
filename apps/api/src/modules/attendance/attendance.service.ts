import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AttendanceStatus, AttendanceMethod } from '@prisma/client';
import { ScanAttendanceDto, ManualAttendanceDto } from './dto/submit-attendance.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService) {}

  async getActiveDailyQR() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let activeQr = await this.prisma.attendanceQR.findFirst({
      where: {
        date: today,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!activeQr) {
      const token = `SMK1-QR-${today.toISOString().split('T')[0]}-${uuidv4().substring(0, 8)}`;
      activeQr = await this.prisma.attendanceQR.create({
        data: {
          code: `QR-${Date.now()}`,
          token,
          date: today,
          session: new Date().getHours() < 12 ? 'PAGI' : 'SORE',
          expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
          isActive: true,
        },
      });
    }

    return activeQr;
  }

  async scanQR(userId: string, dto: ScanAttendanceDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
      include: { class: true, user: true },
    });

    if (!student) {
      throw new BadRequestException('Akun ini tidak terdaftar sebagai Siswa');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Verify QR token
    const qr = await this.prisma.attendanceQR.findFirst({
      where: {
        token: dto.qrToken,
        isActive: true,
        expiresAt: { gt: new Date() },
      },
    });

    if (!qr) {
      throw new BadRequestException('QR Code tidak valid atau sudah kadaluarsa');
    }

    const now = new Date();
    // Threshold for terlambat: 07:15 WIB
    const isLate = now.getHours() > 7 || (now.getHours() === 7 && now.getMinutes() > 15);
    const status = isLate ? AttendanceStatus.TERLAMBAT : AttendanceStatus.HADIR;

    const record = await this.prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: student.id,
          date: today,
        },
      },
      update: {
        timeIn: now,
        status,
        method: AttendanceMethod.QR_CODE,
        notes: dto.notes,
      },
      create: {
        studentId: student.id,
        date: today,
        timeIn: now,
        status,
        method: AttendanceMethod.QR_CODE,
        notes: dto.notes,
      },
    });

    return {
      success: true,
      message: isLate
        ? 'Absensi berhasil dicatat (Status: Terlambat)'
        : 'Absensi berhasil dicatat tepat waktu!',
      data: record,
    };
  }

  async setManualAttendance(dto: ManualAttendanceDto, teacherName: string) {
    const dateObj = new Date(dto.date);
    dateObj.setHours(0, 0, 0, 0);

    return this.prisma.attendance.upsert({
      where: {
        studentId_date: {
          studentId: dto.studentId,
          date: dateObj,
        },
      },
      update: {
        status: dto.status,
        method: AttendanceMethod.MANUAL,
        verifiedBy: teacherName,
        notes: dto.notes,
      },
      create: {
        studentId: dto.studentId,
        date: dateObj,
        status: dto.status,
        method: AttendanceMethod.MANUAL,
        verifiedBy: teacherName,
        notes: dto.notes,
      },
    });
  }

  async getMyAttendanceHistory(userId: string) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      return [];
    }

    return this.prisma.attendance.findMany({
      where: { studentId: student.id },
      orderBy: { date: 'desc' },
      take: 30,
    });
  }

  async getClassRecap(classId: string, dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const students = await this.prisma.student.findMany({
      where: { classId },
      include: {
        user: true,
        attendances: {
          where: { date: targetDate },
        },
      },
      orderBy: { user: { name: 'asc' } },
    });

    const recap = students.map((s) => {
      const att = s.attendances[0];
      return {
        studentId: s.id,
        name: s.user.name,
        nisn: s.nisn,
        status: att ? att.status : AttendanceStatus.ALPHA,
        timeIn: att?.timeIn || null,
        method: att?.method || null,
        notes: att?.notes || null,
      };
    });

    const stats = {
      total: recap.length,
      hadir: recap.filter((r) => r.status === AttendanceStatus.HADIR).length,
      terlambat: recap.filter((r) => r.status === AttendanceStatus.TERLAMBAT).length,
      izin: recap.filter((r) => r.status === AttendanceStatus.IZIN).length,
      sakit: recap.filter((r) => r.status === AttendanceStatus.SAKIT).length,
      alpha: recap.filter((r) => r.status === AttendanceStatus.ALPHA).length,
    };

    return { date: targetDate, stats, students: recap };
  }
}
