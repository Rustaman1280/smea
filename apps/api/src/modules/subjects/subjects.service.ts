import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreateAssignmentDto, SubmitAssignmentDto, GradeSubmissionDto } from './dto/create-assignment.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async getAllSubjects() {
    return this.prisma.subject.findMany({
      include: {
        major: true,
        _count: { select: { schedules: true, materials: true, assignments: true } },
      },
      orderBy: { code: 'asc' },
    });
  }

  async getSchedules(classId?: string, teacherId?: string) {
    return this.prisma.schedule.findMany({
      where: {
        classId: classId || undefined,
        teacherId: teacherId || undefined,
      },
      include: {
        subject: true,
        class: true,
        teacher: { include: { user: true } },
      },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getMaterials(subjectId?: string, classId?: string) {
    return this.prisma.learningMaterial.findMany({
      where: {
        subjectId: subjectId || undefined,
        classId: classId || undefined,
      },
      include: {
        subject: true,
        class: true,
        teacher: { include: { user: true } },
      },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async createMaterial(teacherUserId: string, dto: CreateMaterialDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherUserId },
    });

    if (!teacher) {
      throw new BadRequestException('Hanya akun guru yang dapat mengupload materi');
    }

    return this.prisma.learningMaterial.create({
      data: {
        subjectId: dto.subjectId,
        classId: dto.classId,
        teacherId: teacher.id,
        title: dto.title,
        description: dto.description,
        fileUrl: dto.fileUrl,
        linkUrl: dto.linkUrl,
      },
    });
  }

  async getAssignments(classId?: string) {
    return this.prisma.assignment.findMany({
      where: classId ? { classId } : undefined,
      include: {
        subject: true,
        class: true,
        teacher: { include: { user: true } },
        submissions: {
          include: { student: { include: { user: true } } },
        },
        _count: { select: { submissions: true } },
      },
      orderBy: { deadline: 'asc' },
    });
  }

  async createAssignment(teacherUserId: string, dto: CreateAssignmentDto) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { userId: teacherUserId },
    });

    if (!teacher) {
      throw new BadRequestException('Hanya akun guru yang dapat membuat tugas');
    }

    return this.prisma.assignment.create({
      data: {
        subjectId: dto.subjectId,
        classId: dto.classId,
        teacherId: teacher.id,
        title: dto.title,
        description: dto.description,
        deadline: new Date(dto.deadline),
        maxScore: dto.maxScore ?? 100,
      },
    });
  }

  async submitAssignment(studentUserId: string, dto: SubmitAssignmentDto) {
    const student = await this.prisma.student.findUnique({
      where: { userId: studentUserId },
    });

    if (!student) {
      throw new BadRequestException('Hanya akun siswa yang dapat mengumpulkan tugas');
    }

    return this.prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId: dto.assignmentId,
          studentId: student.id,
        },
      },
      update: {
        submissionUrl: dto.submissionUrl,
        notes: dto.notes,
        submittedAt: new Date(),
      },
      create: {
        assignmentId: dto.assignmentId,
        studentId: student.id,
        submissionUrl: dto.submissionUrl,
        notes: dto.notes,
      },
    });
  }

  async gradeSubmission(submissionId: string, dto: GradeSubmissionDto) {
    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        score: dto.score,
        feedback: dto.feedback,
        gradedAt: new Date(),
      },
    });
  }
}
