import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectTaskDto, MoveTaskColumnDto, CreatePklJournalDto } from './dto/create-task.dto';
import { TaskColumn, ProjectStatus } from '@prisma/client';

@Injectable()
export class ProjectTrackerService {
  constructor(private prisma: PrismaService) {}

  async getAllProjects(classId?: string, supervisorId?: string) {
    return this.prisma.vocationalProject.findMany({
      where: {
        classId: classId || undefined,
        supervisorId: supervisorId || undefined,
      },
      include: {
        leader: { select: { id: true, name: true, role: true } },
        supervisor: { select: { id: true, name: true } },
        class: true,
        tasks: { orderBy: { createdAt: 'asc' } },
        _count: { select: { tasks: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProjectById(id: string) {
    const project = await this.prisma.vocationalProject.findUnique({
      where: { id },
      include: {
        leader: { select: { id: true, name: true, role: true } },
        supervisor: { select: { id: true, name: true } },
        class: true,
        tasks: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!project) {
      throw new NotFoundException('Proyek tidak ditemukan');
    }

    return project;
  }

  async createProject(leaderUserId: string, dto: CreateProjectDto) {
    return this.prisma.vocationalProject.create({
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        major: dto.major,
        classId: dto.classId,
        leaderId: leaderUserId,
        supervisorId: dto.supervisorId,
        deadline: new Date(dto.deadline),
        githubUrl: dto.githubUrl,
        demoUrl: dto.demoUrl,
        status: ProjectStatus.ACTIVE,
      },
    });
  }

  async createTask(dto: CreateProjectTaskDto) {
    return this.prisma.projectTask.create({
      data: {
        projectId: dto.projectId,
        title: dto.title,
        description: dto.description,
        assigneeName: dto.assigneeName,
        column: dto.column || TaskColumn.TODO,
        priority: dto.priority,
      },
    });
  }

  async moveTaskColumn(taskId: string, dto: MoveTaskColumnDto) {
    return this.prisma.projectTask.update({
      where: { id: taskId },
      data: { column: dto.column },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.projectTask.delete({
      where: { id: taskId },
    });
  }

  async createPklJournal(studentUserId: string, dto: CreatePklJournalDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId: studentUserId },
    });

    if (!student) {
      throw new BadRequestException('Hanya akun siswa yang dapat mengisi jurnal PKL');
    }

    const journalDate = new Date(dto.date);
    journalDate.setHours(0, 0, 0, 0);

    return this.prisma.pklJournal.create({
      data: {
        studentId: student.id,
        companyName: dto.companyName,
        date: journalDate,
        activityDescription: dto.activityDescription,
        competencyLearned: dto.competencyLearned,
        photoUrl: dto.photoUrl,
        verifiedBySupervisor: false,
      },
    });
  }

  async getPklJournals(studentId?: string) {
    return this.prisma.pklJournal.findMany({
      where: studentId ? { studentId } : undefined,
      include: {
        student: { include: { user: true, class: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async verifyPklJournal(journalId: string, supervisorNotes?: string) {
    return this.prisma.pklJournal.update({
      where: { id: journalId },
      data: {
        verifiedBySupervisor: true,
        supervisorNotes,
      },
    });
  }
}
