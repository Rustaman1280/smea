import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { ScanAttendanceDto, ManualAttendanceDto } from './dto/submit-attendance.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Modul 1 - Absensi Digital Siswa')
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('qr-today')
  @ApiOperation({ summary: 'Dapatkan token QR harian aktif untuk ditampilkan di kelas/proyektor' })
  async getDailyQR() {
    return this.attendanceService.getActiveDailyQR();
  }

  @Post('scan')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Scan QR token absensi oleh siswa' })
  async scanQR(
    @CurrentUser('id') userId: string,
    @Body() dto: ScanAttendanceDto,
  ) {
    return this.attendanceService.scanQR(userId, dto);
  }

  @Post('manual')
  @Roles(Role.GURU, Role.WALI_KELAS, Role.ADMIN)
  @ApiOperation({ summary: 'Input / update status absensi manual oleh guru atau wali kelas' })
  async setManualAttendance(
    @CurrentUser('name') teacherName: string,
    @Body() dto: ManualAttendanceDto,
  ) {
    return this.attendanceService.setManualAttendance(dto, teacherName);
  }

  @Get('history/me')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Riwayat absensi siswa yang sedang login' })
  async getMyHistory(@CurrentUser('id') userId: string) {
    return this.attendanceService.getMyAttendanceHistory(userId);
  }

  @Get('recap/class')
  @Roles(Role.GURU, Role.WALI_KELAS, Role.GURU_BK, Role.STAFF_TU, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Rekap absensi per kelas harian untuk Guru & Wali Kelas' })
  @ApiQuery({ name: 'classId', required: true })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  async getClassRecap(
    @Query('classId') classId: string,
    @Query('date') date?: string,
  ) {
    return this.attendanceService.getClassRecap(classId, date);
  }
}
