import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ExtracurricularService } from './extracurricular.service';
import { CreateExtracurricularDto, AddAchievementDto } from './dto/create-club.dto';
import { JoinClubDto } from './dto/join-club.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, ExtracurricularCategory } from '@prisma/client';

@ApiTags('Modul 5 - Ekstrakurikuler')
@Controller('extracurricular')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExtracurricularController {
  constructor(private readonly extracurricularService: ExtracurricularService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar semua klub ekstrakurikuler SMKN 1 Garut' })
  @ApiQuery({ name: 'category', enum: ExtracurricularCategory, required: false })
  async getAllClubs(@Query('category') category?: ExtracurricularCategory) {
    return this.extracurricularService.getAllClubs(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail klub ekskul, daftar anggota, dan piagam prestasi' })
  async getClubById(@Param('id') id: string) {
    return this.extracurricularService.getClubById(id);
  }

  @Post('join')
  @Roles(Role.SISWA)
  @ApiOperation({ summary: 'Pendaftaran ekskul secara online oleh siswa' })
  async registerStudent(
    @CurrentUser('id') userId: string,
    @Body() dto: JoinClubDto,
  ) {
    return this.extracurricularService.registerStudentToClub(userId, dto);
  }

  @Post()
  @Roles(Role.PEMBINA_EKSKUL, Role.ADMIN)
  @ApiOperation({ summary: 'Buat ekstrakurikuler baru oleh Pembina / Admin' })
  async createClub(
    @CurrentUser('teacherId') teacherId: string,
    @Body() dto: CreateExtracurricularDto,
  ) {
    return this.extracurricularService.createClub(teacherId, dto);
  }

  @Post(':id/achievements')
  @Roles(Role.PEMBINA_EKSKUL, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah piagam prestasi / juara lomba ekskul' })
  async addAchievement(
    @Param('id') clubId: string,
    @Body() dto: AddAchievementDto,
  ) {
    return this.extracurricularService.addAchievement(clubId, dto);
  }
}
