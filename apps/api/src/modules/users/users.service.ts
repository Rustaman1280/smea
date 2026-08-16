import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(role?: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        isActive: true,
        createdAt: true,
        student: {
          include: { class: true },
        },
        teacher: {
          include: { homeroomClass: true },
        },
        staff: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        role: true,
        avatarUrl: true,
        phone: true,
        isActive: true,
        createdAt: true,
        student: {
          include: { class: { include: { major: true } } },
        },
        teacher: {
          include: { homeroomClass: true, schedules: true },
        },
        staff: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Pengguna tidak ditemukan');
    }

    return user;
  }

  async getClasses() {
    return this.prisma.class.findMany({
      include: {
        major: true,
        homeroomTeacher: {
          include: { user: true },
        },
        _count: {
          select: { students: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async getMajors() {
    return this.prisma.major.findMany({
      include: {
        _count: {
          select: { classes: true, subjects: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }
}
