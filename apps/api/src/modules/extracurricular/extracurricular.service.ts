import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExtracurricularDto, AddAchievementDto } from './dto/create-club.dto';
import { JoinClubDto, UpdateMemberStatusDto } from './dto/join-club.dto';
import { ExtracurricularCategory, ClubMemberStatus } from '@prisma/client';

@Injectable()
export class ExtracurricularService {
  constructor(private prisma: PrismaService) {}

  async getAllClubs(category?: ExtracurricularCategory) {
    return this.prisma.extracurricular.findMany({
      where: category ? { category } : undefined,
      include: {
        pembina: { include: { user: true } },
        achievements: { orderBy: { year: 'desc' } },
        members: {
          include: { student: { include: { user: true, class: true } } },
        },
        _count: { select: { members: true, achievements: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getClubById(id: string) {
    const club = await this.prisma.extracurricular.findUnique({
      where: { id },
      include: {
        pembina: { include: { user: true } },
        achievements: { orderBy: { year: 'desc' } },
        members: {
          include: { student: { include: { user: true, class: true } } },
        },
      },
    });

    if (!club) {
      throw new NotFoundException('Ekskul tidak ditemukan');
    }

    return club;
  }

  async registerStudentToClub(userId: string, dto: JoinClubDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      throw new BadRequestException('Hanya akun siswa yang dapat mendaftar ekskul');
    }

    const existing = await this.prisma.extracurricularMember.findUnique({
      where: {
        clubId_studentId: {
          clubId: dto.clubId,
          studentId: student.id,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Anda sudah terdaftar atau mengajukan pendaftaran di ekskul ini');
    }

    return this.prisma.extracurricularMember.create({
      data: {
        clubId: dto.clubId,
        studentId: student.id,
        status: ClubMemberStatus.ACTIVE,
      },
      include: { club: true },
    });
  }

  async createClub(pembinaTeacherId: string, dto: CreateExtracurricularDto) {
    return this.prisma.extracurricular.create({
      data: {
        name: dto.name,
        description: dto.description,
        category: dto.category,
        coachName: dto.coachName,
        pembinaId: pembinaTeacherId,
        scheduleDay: dto.scheduleDay,
        scheduleTime: dto.scheduleTime,
        location: dto.location,
        isRecruiting: true,
      },
    });
  }

  async addAchievement(clubId: string, dto: AddAchievementDto) {
    return this.prisma.extracurricularAchievement.create({
      data: {
        clubId,
        title: dto.title,
        competition: dto.competition,
        level: dto.level,
        rank: dto.rank,
        year: dto.year,
      },
    });
  }
}
