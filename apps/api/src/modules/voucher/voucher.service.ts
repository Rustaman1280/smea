import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GenerateVoucherBatchDto } from './dto/generate-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';
import { VoucherStatus, PaymentMethod } from '@prisma/client';

@Injectable()
export class VoucherService {
  constructor(private prisma: PrismaService) {}

  async generateBatch(dto: GenerateVoucherBatchDto) {
    const vouchersData: Array<{
      code: string;
      profileName: string;
      durationHours: number;
      quotaMb: number | null;
      price: number;
      status: VoucherStatus;
      batchNumber: string;
    }> = [];

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    for (let i = 0; i < dto.count; i++) {
      let randomCode = 'SMK-';
      for (let j = 0; j < 6; j++) {
        randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      vouchersData.push({
        code: randomCode,
        profileName: dto.profileName,
        durationHours: dto.durationHours,
        quotaMb: dto.quotaMb || null,
        price: dto.price,
        status: VoucherStatus.AVAILABLE,
        batchNumber: dto.batchNumber,
      });
    }

    return this.prisma.hotspotVoucher.createMany({
      data: vouchersData,
      skipDuplicates: true,
    });
  }

  async getAvailableVouchers() {
    return this.prisma.hotspotVoucher.findMany({
      where: { status: VoucherStatus.AVAILABLE },
      orderBy: { price: 'asc' },
    });
  }

  async getAllVouchers(batchNumber?: string, status?: VoucherStatus) {
    return this.prisma.hotspotVoucher.findMany({
      where: {
        batchNumber: batchNumber || undefined,
        status: status || undefined,
      },
      include: {
        buyer: { select: { id: true, name: true, role: true } },
        transaction: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async buyVoucher(buyerUserId: string, dto: BuyVoucherDto) {
    const voucher = await this.prisma.hotspotVoucher.findUnique({
      where: { id: dto.voucherId },
    });

    if (!voucher || voucher.status !== VoucherStatus.AVAILABLE) {
      throw new BadRequestException('Voucher ini sudah tidak tersedia');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + voucher.durationHours * 60 * 60 * 1000);

    const updatedVoucher = await this.prisma.hotspotVoucher.update({
      where: { id: voucher.id },
      data: {
        status: VoucherStatus.SOLD,
        buyerId: buyerUserId,
        purchasedAt: now,
        expiresAt,
      },
    });

    await this.prisma.voucherTransaction.create({
      data: {
        voucherId: voucher.id,
        userId: buyerUserId,
        amount: voucher.price,
        paymentMethod: dto.paymentMethod,
        transactionDate: now,
      },
    });

    return {
      success: true,
      message: 'Voucher berhasil dibeli!',
      voucher: updatedVoucher,
    };
  }

  async getMyPurchasedVouchers(buyerUserId: string) {
    return this.prisma.hotspotVoucher.findMany({
      where: { buyerId: buyerUserId },
      include: { transaction: true },
      orderBy: { purchasedAt: 'desc' },
    });
  }

  async getIspAnalytics() {
    const [total, available, sold, transactions] = await Promise.all([
      this.prisma.hotspotVoucher.count(),
      this.prisma.hotspotVoucher.count({ where: { status: VoucherStatus.AVAILABLE } }),
      this.prisma.hotspotVoucher.count({ where: { status: VoucherStatus.SOLD } }),
      this.prisma.voucherTransaction.findMany(),
    ]);

    const totalRevenue = transactions.reduce((acc, t) => acc + t.amount, 0);

    return {
      totalVouchers: total,
      availableVouchers: available,
      soldVouchers: sold,
      totalRevenue,
      transactionsCount: transactions.length,
    };
  }
}
