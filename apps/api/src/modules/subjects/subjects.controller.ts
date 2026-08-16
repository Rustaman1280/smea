import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { CreateAssignmentDto, SubmitAssignmentDto, GradeSubmissionDto } from './dto/create-assignment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Modul 6 - Mata Pelajaran & Mini LMS')
@Controller('subjects')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar semua mata pelajaran' })
  async getAllSubjects() {
    return this.subjectsService.getAllSubjects();
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Jadwal pelajaran per kelas atau per guru' })
  @ApiQuery({ name: 'classId', required: false })
  @ApiQuery({ name: 'teacherId', required: false })
  async getSchedules(
    @Query('classId') classId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    return this.subjectsService.getSchedules(classId, teacherId);
  }

  @Get('materials')
  @ApiOperation({ summary: 'Daftar materi pembelajaran digital (PDF / link)' })
  @ApiQuery({ name: 'subjectId', required: false })
  @ApiQuery({ name: 'classId', required: false })
  async getMaterials(
    @Query('subjectId') subjectId?: string,
    @Query('classId') classId?: string,
  ) {
    return this.subjectsService.getMaterials(subjectId, classId);
  }

  @Post('materials')
  @Roles(Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Upload materi pembelajaran baru oleh Guru' })
  async createMaterial(
    @CurrentUser('id') teacherUserId: string,
    @Body() dto: CreateMaterialDto,
  ) {
    return this.subjectsService.createMaterial(teacherUserId, dto);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'Daftar tugas kelas dan batas waktu pengumpulan' })
  @ApiQuery({ name: 'classId', required: false })
  async getAssignments(@Query('classId') classId?: string) {
    return this.subjectsService.getAssignments(classId);
  }

  @Post('assignments')
  @Roles(Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Buat tugas kelas baru oleh Guru' })
  async createAssignment(
    @CurrentUser('id') teacherUserId: string,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.subjectsService.createAssignment(teacherUserId, dto);
  }

  @Post('assignments/submit')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Kumpul tugas mandiri oleh Siswa' })
  async submitAssignment(
    @CurrentUser('id') studentUserId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.subjectsService.submitAssignment(studentUserId, dto);
  }

  @Patch('assignments/submissions/:id/grade')
  @Roles(Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Input nilai dan koreksi feedback guru pada tugas siswa' })
  async gradeSubmission(
    @Param('id') submissionId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.subjectsService.gradeSubmission(submissionId, dto);
  }
}
