import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DisciplineService } from './discipline.service';
import { CreateDisciplineCaseDto, CreateCounselingSessionDto } from './dto/create-case.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Modul 3 - BK & Pelanggaran (Data Sensitif Terbatas)')
@Controller('discipline')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DisciplineController {
  constructor(private readonly disciplineService: DisciplineService) {}

  @Post('cases')
  @Roles(Role.GURU_BK, Role.WALI_KELAS, Role.ADMIN)
  @ApiOperation({ summary: 'Input kasus pelanggaran siswa & akumulasi poin' })
  async createCase(
    @CurrentUser('id') reporterId: string,
    @Body() dto: CreateDisciplineCaseDto,
  ) {
    return this.disciplineService.createCase(reporterId, dto);
  }

  @Get('cases')
  @Roles(Role.GURU_BK, Role.WALI_KELAS, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Daftar seluruh kasus pelanggaran siswa (Akses Guru BK & Wali Kelas)' })
  @ApiQuery({ name: 'studentId', required: false })
  async getAllCases(@Query('studentId') studentId?: string) {
    return this.disciplineService.getAllCases(studentId);
  }

  @Get('my-record')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Lihat rekam poin pelanggaran & riwayat konseling diri sendiri (Siswa)' })
  async getMyDisciplinaryRecord(@CurrentUser('id') userId: string) {
    return this.disciplineService.getMyDisciplinaryRecord(userId);
  }

  @Post('counseling')
  @Roles(Role.GURU_BK, Role.ADMIN)
  @ApiOperation({ summary: 'Catat sesi bimbingan konseling dan tindak lanjut' })
  async createCounselingSession(
    @CurrentUser('id') counselorId: string,
    @Body() dto: CreateCounselingSessionDto,
  ) {
    return this.disciplineService.createCounselingSession(counselorId, dto);
  }

  @Get('counseling')
  @Roles(Role.GURU_BK, Role.WALI_KELAS, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Daftar sesi konseling siswa' })
  async getAllCounselingSessions() {
    return this.disciplineService.getAllCounselingSessions();
  }

  @Get('letter/parent-summons/:caseId')
  @Roles(Role.GURU_BK, Role.WALI_KELAS, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Generate template formal Surat Panggilan Orang Tua' })
  async generateParentSummonsLetter(@Param('caseId') caseId: string) {
    return this.disciplineService.generateParentSummonsLetter(caseId);
  }
}
