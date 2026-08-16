import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CanteenCategory } from '@prisma/client';

export class CreateCanteenMenuDto {
  @ApiProperty({ description: 'ID Stand Kantin' })
  @IsNotEmpty()
  @IsString()
  standId: string;

  @ApiProperty({ description: 'Nama Menu' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: 'Deskripsi menu' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Harga dalam Rupiah' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ enum: CanteenCategory, default: CanteenCategory.MAKANAN_BERAT })
  @IsNotEmpty()
  @IsEnum(CanteenCategory)
  category: CanteenCategory;

  @ApiProperty({ required: false, description: 'URL Foto makanan' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ default: 50, description: 'Jumlah stok tersedia' })
  @IsOptional()
  @IsNumber()
  stock?: number;
}

export class ToggleMenuAvailabilityDto {
  @ApiProperty({ description: 'Status ketersediaan menu (true: Tersedia, false: Habis)' })
  @IsNotEmpty()
  @IsBoolean()
  isAvailable: boolean;
}
