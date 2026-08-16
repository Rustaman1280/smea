import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Users & Master Data')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Daftar pengguna sekolah (bisa difilter berdasarkan role)' })
  @ApiQuery({ name: 'role', enum: Role, required: false })
  async findAll(@Query('role') role?: Role) {
    return this.usersService.findAll(role);
  }

  @Get('classes')
  @ApiOperation({ summary: 'Daftar kelas dan wali kelas' })
  async getClasses() {
    return this.usersService.getClasses();
  }

  @Get('majors')
  @ApiOperation({ summary: 'Daftar jurusan kejuruan' })
  async getMajors() {
    return this.usersService.getMajors();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail akun pengguna berdasarkan ID' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
