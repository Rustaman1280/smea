import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCanteenMenuDto, ToggleMenuAvailabilityDto } from './dto/create-canteen-menu.dto';
import { CanteenCategory } from '@prisma/client';

@Injectable()
export class CanteenService {
  constructor(private prisma: PrismaService) {}

  async getAllStands() {
    return this.prisma.canteenStand.findMany({
      include: {
        menus: true,
        _count: { select: { menus: true } },
      },
      orderBy: { standNumber: 'asc' },
    });
  }

  async getAllMenus(category?: CanteenCategory, standId?: string, search?: string) {
    return this.prisma.canteenMenu.findMany({
      where: {
        category: category || undefined,
        standId: standId || undefined,
        name: search ? { contains: search, mode: 'insensitive' } : undefined,
      },
      include: {
        stand: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyStand(userId: string) {
    let stand = await this.prisma.canteenStand.findUnique({
      where: { operatorId: userId },
      include: {
        menus: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!stand) {
      stand = await this.prisma.canteenStand.findFirst({
        include: {
          menus: { orderBy: { createdAt: 'desc' } },
        },
      });
    }

    return stand;
  }

  async createMenu(dto: CreateCanteenMenuDto) {
    return this.prisma.canteenMenu.create({
      data: {
        standId: dto.standId,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        imageUrl: dto.imageUrl,
        stock: dto.stock ?? 50,
        isAvailable: true,
      },
      include: { stand: true },
    });
  }

  async toggleAvailability(menuId: string, dto: ToggleMenuAvailabilityDto) {
    const menu = await this.prisma.canteenMenu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      throw new NotFoundException('Menu tidak ditemukan');
    }

    return this.prisma.canteenMenu.update({
      where: { id: menuId },
      data: { isAvailable: dto.isAvailable },
      include: { stand: true },
    });
  }

  async deleteMenu(menuId: string) {
    return this.prisma.canteenMenu.delete({
      where: { id: menuId },
    });
  }
}
