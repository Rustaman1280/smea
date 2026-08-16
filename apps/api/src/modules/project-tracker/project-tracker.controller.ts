import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectTrackerService } from './project-tracker.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { CreateProjectTaskDto, MoveTaskColumnDto, CreatePklJournalDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Modul 7 - Project Tracker & Jurnal PKL')
@Controller('project-tracker')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProjectTrackerController {
  constructor(private readonly projectTrackerService: ProjectTrackerService) {}

  @Get('projects')
  @ApiOperation({ summary: 'Daftar semua proyek kejuruan / tugas akhir' })
  @ApiQuery({ name: 'classId', required: false })
  @ApiQuery({ name: 'supervisorId', required: false })
  async getAllProjects(
    @Query('classId') classId?: string,
    @Query('supervisorId') supervisorId?: string,
  ) {
    return this.projectTrackerService.getAllProjects(classId, supervisorId);
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Detail proyek beserta task board Kanban' })
  async getProjectById(@Param('id') id: string) {
    return this.projectTrackerService.getProjectById(id);
  }

  @Post('projects')
  @Roles(Role.SISWA, Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Buat proyek baru' })
  async createProject(
    @CurrentUser('id') leaderId: string,
    @Body() dto: CreateProjectDto,
  ) {
    return this.projectTrackerService.createProject(leaderId, dto);
  }

  @Post('tasks')
  @Roles(Role.SISWA, Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah tugas baru ke papan Kanban' })
  async createTask(@Body() dto: CreateProjectTaskDto) {
    return this.projectTrackerService.createTask(dto);
  }

  @Patch('tasks/:id/move')
  @Roles(Role.SISWA, Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Pindahkan kolom tugas Kanban (TODO, IN_PROGRESS, REVIEW, DONE)' })
  async moveTask(
    @Param('id') taskId: string,
    @Body() dto: MoveTaskColumnDto,
  ) {
    return this.projectTrackerService.moveTaskColumn(taskId, dto);
  }

  @Delete('tasks/:id')
  @Roles(Role.SISWA, Role.GURU, Role.ADMIN)
  @ApiOperation({ summary: 'Hapus tugas Kanban' })
  async deleteTask(@Param('id') taskId: string) {
    return this.projectTrackerService.deleteTask(taskId);
  }

  @Post('pkl/journals')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Isi catatan jurnal harian PKL/Prakerin oleh Siswa' })
  async createPklJournal(
    @CurrentUser('id') studentUserId: string,
    @Body() dto: CreatePklJournalDto,
  ) {
    return this.projectTrackerService.createPklJournal(studentUserId, dto);
  }

  @Get('pkl/journals')
  @ApiOperation({ summary: 'Daftar jurnal harian PKL' })
  @ApiQuery({ name: 'studentId', required: false })
  async getPklJournals(@Query('studentId') studentId?: string) {
    return this.projectTrackerService.getPklJournals(studentId);
  }

  @Patch('pkl/journals/:id/verify')
  @Roles(Role.GURU, Role.WALI_KELAS, Role.ADMIN)
  @ApiOperation({ summary: 'Verifikasi dan beri catatan supervisi pada jurnal PKL siswa' })
  async verifyJournal(
    @Param('id') journalId: string,
    @Body('notes') notes?: string,
  ) {
    return this.projectTrackerService.verifyPklJournal(journalId, notes);
  }
}
