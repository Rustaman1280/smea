import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TeacherAttendanceService } from './teacher-attendance.service';
import { TeacherCheckInDto, CreateTeachingSessionDto } from './dto/teacher-checkin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Modul 2 - Absen Guru & BKD')
@Controller('teacher-attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TeacherAttendanceController {
  constructor(private readonly teacherAttendanceService: TeacherAttendanceService) {}

  @Post('check-in')
  @Roles(Role.GURU, Role.GURU_BK, Role.WALI_KELAS, Role.PEMBINA_EKSKUL)
  @ApiOperation({ summary: 'Check-in kehadiran masuk guru' })
  async checkIn(
    @CurrentUser('id') userId: string,
    @Body() dto: TeacherCheckInDto,
  ) {
    return this.teacherAttendanceService.checkIn(userId, dto);
  }

  @Post('check-out')
  @Roles(Role.GURU, Role.GURU_BK, Role.WALI_KELAS, Role.PEMBINA_EKSKUL)
  @ApiOperation({ summary: 'Check-out kehadiran pulang guru' })
  async checkOut(@CurrentUser('id') userId: string) {
    return this.teacherAttendanceService.checkOut(userId);
  }

  @Post('session')
  @Roles(Role.GURU, Role.GURU_BK, Role.WALI_KELAS, Role.PEMBINA_EKSKUL)
  @ApiOperation({ summary: 'Log sesi jam mengajar kelas untuk laporan BKD' })
  async addTeachingSession(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateTeachingSessionDto,
  ) {
    return this.teacherAttendanceService.addTeachingSession(userId, dto);
  }

  @Get('today/me')
  @Roles(Role.GURU, Role.GURU_BK, Role.WALI_KELAS, Role.PEMBINA_EKSKUL)
  @ApiOperation({ summary: 'Status kehadiran & jam mengajar guru hari ini' })
  async getMyTodayAttendance(@CurrentUser('id') userId: string) {
    return this.teacherAttendanceService.getMyTodayAttendance(userId);
  }

  @Get('summary')
  @Roles(Role.ADMIN, Role.KEPSEK, Role.STAFF_TU)
  @ApiOperation({ summary: 'Rekap kehadiran seluruh guru untuk Kepala Sekolah & TU' })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  async getSummaryAllTeachers(@Query('date') date?: string) {
    return this.teacherAttendanceService.getSummaryAllTeachers(date);
  }
}
