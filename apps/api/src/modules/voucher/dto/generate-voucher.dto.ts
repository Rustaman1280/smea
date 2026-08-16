import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateVoucherBatchDto {
  @ApiProperty({ default: 10, description: 'Jumlah voucher yang ingin di-generate' })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({ example: '1 Hari - Unlimited 10 Mbps', description: 'Nama Paket Profil' })
  @IsNotEmpty()
  @IsString()
  profileName: string;

  @ApiProperty({ example: 24, description: 'Durasi waktu dalam jam' })
  @IsNotEmpty()
  @IsNumber()
  durationHours: number;

  @ApiProperty({ required: false, example: 2048, description: 'Batas kuota dalam MB (null untuk unlimited)' })
  @IsOptional()
  @IsNumber()
  quotaMb?: number;

  @ApiProperty({ example: 3000, description: 'Harga jual voucher (Rp)' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'BATCH-2026-08', description: 'Nomor Batch' })
  @IsNotEmpty()
  @IsString()
  batchNumber: string;
}
