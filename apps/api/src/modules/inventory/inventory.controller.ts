import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-item.dto';
import { CreateBorrowRequestDto, UpdateBorrowStatusDto, CreateMaintenanceLogDto } from './dto/borrow-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, ItemCategory, BorrowStatus } from '@prisma/client';

@ApiTags('Modul 8 - Inventaris Sarpras')
@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('items')
  @ApiOperation({ summary: 'Daftar aset & alat inventaris sekolah' })
  @ApiQuery({ name: 'category', enum: ItemCategory, required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllItems(
    @Query('category') category?: ItemCategory,
    @Query('search') search?: string,
  ) {
    return this.inventoryService.getAllItems(category, search);
  }

  @Post('items')
  @Roles(Role.PETUGAS_SARPRAS, Role.ADMIN)
  @ApiOperation({ summary: 'Tambah aset baru ke sistem inventaris' })
  async createItem(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.createItem(dto);
  }

  @Post('borrow')
  @ApiOperation({ summary: 'Ajukan peminjaman alat / sarpras (Siswa & Guru)' })
  async createBorrowRequest(
    @CurrentUser('id') borrowerUserId: string,
    @Body() dto: CreateBorrowRequestDto,
  ) {
    return this.inventoryService.createBorrowRequest(borrowerUserId, dto);
  }

  @Get('borrowings')
  @ApiOperation({ summary: 'Daftar riwayat peminjaman barang' })
  @ApiQuery({ name: 'status', enum: BorrowStatus, required: false })
  async getBorrowings(@Query('status') status?: BorrowStatus) {
    return this.inventoryService.getBorrowings(undefined, status);
  }

  @Patch('borrowings/:id/status')
  @Roles(Role.PETUGAS_SARPRAS, Role.ADMIN)
  @ApiOperation({ summary: 'Approval peminjaman & verifikasi pengembalian barang oleh Petugas Sarpras' })
  async updateBorrowStatus(
    @Param('id') borrowingId: string,
    @CurrentUser('name') officerName: string,
    @Body() dto: UpdateBorrowStatusDto,
  ) {
    return this.inventoryService.updateBorrowStatus(borrowingId, officerName, dto);
  }

  @Post('maintenance')
  @Roles(Role.PETUGAS_SARPRAS, Role.ADMIN)
  @ApiOperation({ summary: 'Catat laporan perbaikan / maintenance alat rusak' })
  async createMaintenanceLog(@Body() dto: CreateMaintenanceLogDto) {
    return this.inventoryService.createMaintenanceLog(dto);
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Daftar riwayat perawatan & perbaikan aset' })
  async getMaintenanceLogs() {
    return this.inventoryService.getMaintenanceLogs();
  }
}
