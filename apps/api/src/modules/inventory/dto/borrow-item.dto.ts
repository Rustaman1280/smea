import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BorrowStatus } from '@prisma/client';

export class CreateBorrowRequestDto {
  @ApiProperty({ description: 'ID Barang yang akan dipinjam' })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({ default: 1, description: 'Jumlah unit yang dipinjam' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Target tanggal pengembalian (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  expectedReturnDate: string;

  @ApiProperty({ description: 'Tujuan peminjaman' })
  @IsNotEmpty()
  @IsString()
  purpose: string;
}

export class UpdateBorrowStatusDto {
  @ApiProperty({ enum: BorrowStatus })
  @IsNotEmpty()
  @IsEnum(BorrowStatus)
  status: BorrowStatus;

  @ApiProperty({ required: false, description: 'Catatan petugas sarpras' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateMaintenanceLogDto {
  @ApiProperty({ description: 'ID Barang yang diservis' })
  @IsNotEmpty()
  @IsString()
  itemId: string;

  @ApiProperty({ description: 'Deskripsi kendala / kerusakan' })
  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @ApiProperty({ required: false, description: 'Tindakan perbaikan' })
  @IsOptional()
  @IsString()
  actionTaken?: string;

  @ApiProperty({ required: false, description: 'Biaya perbaikan' })
  @IsOptional()
  @IsNumber()
  cost?: number;
}
