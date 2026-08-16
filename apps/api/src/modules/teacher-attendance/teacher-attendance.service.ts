import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeacherAttendanceStatus } from '@prisma/client';
import { TeacherCheckInDto, CreateTeachingSessionDto } from './dto/teacher-checkin.dto';

@Injectable()
export class TeacherAttendanceService {
  constructor(private prisma: PrismaService) {}

  async checkIn(userId: string, dto: TeacherCheckInDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new BadRequestException('Akun ini tidak terdaftar sebagai Guru');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const now = new Date();

    return this.prisma.teacherAttendance.upsert({
      where: {
        teacherId_date: {
          teacherId: teacher.id,
          date: today,
        },
      },
      update: {
        timeIn: now,
        status: dto.status,
        latitude: dto.latitude,
        longitude: dto.longitude,
        notes: dto.notes,
        photoUrl: dto.photoUrl,
      },
      create: {
        teacherId: teacher.id,
        date: today,
        timeIn: now,
        status: dto.status,
        latitude: dto.latitude,
        longitude: dto.longitude,
        notes: dto.notes,
        photoUrl: dto.photoUrl,
      },
      include: {
        teachingSessions: true,
      },
    });
  }

  async checkOut(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new BadRequestException('Akun ini tidak terdaftar sebagai Guru');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.teacherAttendance.findUnique({
      where: {
        teacherId_date: {
          teacherId: teacher.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      throw new BadRequestException('Belum melakukan check-in hari ini');
    }

    return this.prisma.teacherAttendance.update({
      where: { id: attendance.id },
      data: { timeOut: new Date() },
    });
  }

  async addTeachingSession(userId: string, dto: CreateTeachingSessionDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      throw new BadRequestException('Akun tidak terdaftar sebagai Guru');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await this.prisma.teacherAttendance.findUnique({
      where: {
        teacherId_date: {
          teacherId: teacher.id,
          date: today,
        },
      },
    });

    if (!attendance) {
      attendance = await this.prisma.teacherAttendance.create({
        data: {
          teacherId: teacher.id,
          date: today,
          timeIn: new Date(),
          status: TeacherAttendanceStatus.HADIR,
        },
      });
    }

    return this.prisma.teachingSession.create({
      data: {
        teacherAttendanceId: attendance.id,
        subjectName: dto.subjectName,
        className: dto.className,
        startPeriod: dto.startPeriod,
        endPeriod: dto.endPeriod,
        topicTaught: dto.topicTaught,
        studentCount: dto.studentCount,
      },
    });
  }

  async getMyTodayAttendance(userId: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.teacherAttendance.findUnique({
      where: {
        teacherId_date: {
          teacherId: teacher.id,
          date: today,
        },
      },
      include: {
        teachingSessions: true,
      },
    });
  }

  async getSummaryAllTeachers(dateStr?: string) {
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    targetDate.setHours(0, 0, 0, 0);

    const teachers = await this.prisma.teacher.findMany({
      include: {
        user: true,
        attendances: {
          where: { date: targetDate },
          include: { teachingSessions: true },
        },
      },
      orderBy: { user: { name: 'asc' } },
    });

    return teachers.map((t) => {
      const att = t.attendances[0];
      return {
        teacherId: t.id,
        name: t.user.name,
        nip: t.nip,
        specialization: t.specialization,
        status: att ? att.status : TeacherAttendanceStatus.ALPHA,
        timeIn: att?.timeIn || null,
        timeOut: att?.timeOut || null,
        notes: att?.notes || null,
        totalTeachingHours: att
          ? att.teachingSessions.reduce(
              (acc, s) => acc + (s.endPeriod - s.startPeriod + 1),
              0,
            )
          : 0,
        teachingSessions: att?.teachingSessions || [],
      };
    });
  }
}
