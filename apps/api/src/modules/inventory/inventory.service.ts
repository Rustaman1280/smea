import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInventoryItemDto } from './dto/create-item.dto';
import { CreateBorrowRequestDto, UpdateBorrowStatusDto, CreateMaintenanceLogDto } from './dto/borrow-item.dto';
import { ItemCategory, BorrowStatus } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  async getAllItems(category?: ItemCategory, search?: string) {
    return this.prisma.inventoryItem.findMany({
      where: {
        category: category || undefined,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: {
        _count: { select: { borrowings: true, maintenanceLogs: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createItem(dto: CreateInventoryItemDto) {
    return this.prisma.inventoryItem.create({
      data: {
        code: dto.code,
        name: dto.name,
        category: dto.category,
        location: dto.location,
        quantityTotal: dto.quantityTotal,
        quantityAvailable: dto.quantityTotal,
        condition: dto.condition,
        notes: dto.notes,
      },
    });
  }

  async createBorrowRequest(borrowerUserId: string, dto: CreateBorrowRequestDto) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) {
      throw new NotFoundException('Barang tidak ditemukan');
    }

    if (item.quantityAvailable < dto.quantity) {
      throw new BadRequestException('Stok ketersediaan barang tidak mencukupi');
    }

    return this.prisma.borrowingRecord.create({
      data: {
        itemId: dto.itemId,
        borrowerId: borrowerUserId,
        quantity: dto.quantity,
        expectedReturnDate: new Date(dto.expectedReturnDate),
        purpose: dto.purpose,
        status: BorrowStatus.PENDING,
      },
      include: {
        item: true,
        borrower: { select: { id: true, name: true, role: true } },
      },
    });
  }

  async getBorrowings(userId?: string, status?: BorrowStatus) {
    return this.prisma.borrowingRecord.findMany({
      where: {
        borrowerId: userId || undefined,
        status: status || undefined,
      },
      include: {
        item: true,
        borrower: { select: { id: true, name: true, role: true } },
      },
      orderBy: { borrowDate: 'desc' },
    });
  }

  async updateBorrowStatus(
    borrowingId: string,
    officerName: string,
    dto: UpdateBorrowStatusDto,
  ) {
    const record = await this.prisma.borrowingRecord.findUnique({
      where: { id: borrowingId },
      include: { item: true },
    });

    if (!record) {
      throw new NotFoundException('Data peminjaman tidak ditemukan');
    }

    // Adjust item available quantity
    if (dto.status === BorrowStatus.APPROVED || dto.status === BorrowStatus.BORROWED) {
      await this.prisma.inventoryItem.update({
        where: { id: record.itemId },
        data: { quantityAvailable: { decrement: record.quantity } },
      });
    } else if (dto.status === BorrowStatus.RETURNED) {
      await this.prisma.inventoryItem.update({
        where: { id: record.itemId },
        data: { quantityAvailable: { increment: record.quantity } },
      });
    }

    return this.prisma.borrowingRecord.update({
      where: { id: borrowingId },
      data: {
        status: dto.status,
        approvedBy: officerName,
        actualReturnDate: dto.status === BorrowStatus.RETURNED ? new Date() : undefined,
        notes: dto.notes,
      },
      include: { item: true, borrower: true },
    });
  }

  async createMaintenanceLog(dto: CreateMaintenanceLogDto) {
    return this.prisma.maintenanceLog.create({
      data: {
        itemId: dto.itemId,
        issueDescription: dto.issueDescription,
        actionTaken: dto.actionTaken,
        cost: dto.cost,
        status: 'IN_PROGRESS',
      },
      include: { item: true },
    });
  }

  async getMaintenanceLogs() {
    return this.prisma.maintenanceLog.findMany({
      include: { item: true },
      orderBy: { reportedDate: 'desc' },
    });
  }
}
