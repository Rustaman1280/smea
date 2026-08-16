import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ItemCondition, ItemCategory } from '@prisma/client';

export class CreateInventoryItemDto {
  @ApiProperty({ description: 'Kode Barcode / Aset Barang (misal: LAB-RPL-001)' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: 'Nama Barang / Aset' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ enum: ItemCategory, default: ItemCategory.UMUM })
  @IsNotEmpty()
  @IsEnum(ItemCategory)
  category: ItemCategory;

  @ApiProperty({ description: 'Lokasi penyimpanan di sekolah' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Total jumlah unit barang' })
  @IsNotEmpty()
  @IsNumber()
  quantityTotal: number;

  @ApiProperty({ enum: ItemCondition, default: ItemCondition.BAIK })
  @IsOptional()
  @IsEnum(ItemCondition)
  condition?: ItemCondition;

  @ApiProperty({ required: false, description: 'Catatan spesifikasi / kondisi' })
  @IsOptional()
  @IsString()
  notes?: string;
}
