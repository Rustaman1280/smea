import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VoucherService } from './voucher.service';
import { GenerateVoucherBatchDto } from './dto/generate-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Role, VoucherStatus } from '@prisma/client';

@ApiTags('Modul 9 - ISP Voucher Hotspot')
@Controller('voucher')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Get('available')
  @ApiOperation({ summary: 'Daftar paket voucher hotspot yang tersedia untuk dibeli' })
  async getAvailableVouchers() {
    return this.voucherService.getAvailableVouchers();
  }

  @Post('buy')
  @ApiOperation({ summary: 'Beli voucher hotspot internet sekolah (Siswa & Guru)' })
  async buyVoucher(
    @CurrentUser('id') buyerUserId: string,
    @Body() dto: BuyVoucherDto,
  ) {
    return this.voucherService.buyVoucher(buyerUserId, dto);
  }

  @Get('my-vouchers')
  @ApiOperation({ summary: 'Daftar kode voucher yang telah dibeli oleh akun yang login' })
  async getMyPurchasedVouchers(@CurrentUser('id') userId: string) {
    return this.voucherService.getMyPurchasedVouchers(userId);
  }

  @Post('generate-batch')
  @Roles(Role.OPERATOR_ISP, Role.ADMIN)
  @ApiOperation({ summary: 'Generate batch kode voucher MikroTik/RADIUS baru' })
  async generateBatch(@Body() dto: GenerateVoucherBatchDto) {
    return this.voucherService.generateBatch(dto);
  }

  @Get('all')
  @Roles(Role.OPERATOR_ISP, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Lihat semua data voucher dan status transaksi' })
  @ApiQuery({ name: 'batchNumber', required: false })
  @ApiQuery({ name: 'status', enum: VoucherStatus, required: false })
  async getAllVouchers(
    @Query('batchNumber') batchNumber?: string,
    @Query('status') status?: VoucherStatus,
  ) {
    return this.voucherService.getAllVouchers(batchNumber, status);
  }

  @Get('analytics')
  @Roles(Role.OPERATOR_ISP, Role.ADMIN, Role.KEPSEK)
  @ApiOperation({ summary: 'Statistik analitik penjualan voucher & pendapatan ISP' })
  async getIspAnalytics() {
    return this.voucherService.getIspAnalytics();
  }
}
