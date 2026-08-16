import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CanteenService } from './canteen.service';
import { CreateCanteenMenuDto, ToggleMenuAvailabilityDto } from './dto/create-canteen-menu.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, CanteenCategory } from '@prisma/client';

@ApiTags('Modul 4 - Showcase Kantin')
@Controller('canteen')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CanteenController {
  constructor(private readonly canteenService: CanteenService) {}

  @Get('stands')
  @ApiOperation({ summary: 'Daftar semua stand kantin sekolah' })
  async getAllStands() {
    return this.canteenService.getAllStands();
  }

  @Get('menus')
  @ApiOperation({ summary: 'Katalog seluruh menu makanan & minuman kantin' })
  @ApiQuery({ name: 'category', enum: CanteenCategory, required: false })
  @ApiQuery({ name: 'standId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllMenus(
    @Query('category') category?: CanteenCategory,
    @Query('standId') standId?: string,
    @Query('search') search?: string,
  ) {
    return this.canteenService.getAllMenus(category, standId, search);
  }

  @Get('my-stand')
  @Roles(Role.OPERATOR_KANTIN, Role.ADMIN)
  @ApiOperation({ summary: 'Data stand dan menu untuk Operator Kantin yang login' })
  async getMyStand(@CurrentUser('id') userId: string) {
    return this.canteenService.getMyStand(userId);
  }

  @Post('menus')
  @Roles(Role.OPERATOR_KANTIN, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah menu makanan/minuman baru' })
  async createMenu(@Body() dto: CreateCanteenMenuDto) {
    return this.canteenService.createMenu(dto);
  }

  @Patch('menus/:id/availability')
  @Roles(Role.OPERATOR_KANTIN, Role.ADMIN)
  @ApiOperation({ summary: 'Toggle status ketersediaan menu (Tersedia / Habis)' })
  async toggleAvailability(
    @Param('id') menuId: string,
    @Body() dto: ToggleMenuAvailabilityDto,
  ) {
    return this.canteenService.toggleAvailability(menuId, dto);
  }

  @Delete('menus/:id')
  @Roles(Role.OPERATOR_KANTIN, Role.ADMIN)
  @ApiOperation({ summary: 'Hapus menu kantin' })
  async deleteMenu(@Param('id') menuId: string) {
    return this.canteenService.deleteMenu(menuId);
  }
}
