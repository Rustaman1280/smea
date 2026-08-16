import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus, AttendanceMethod } from '@prisma/client';

export class ScanAttendanceDto {
  @ApiProperty({ description: 'QR Token harian dari layar proyektor / guru' })
  @IsNotEmpty()
  @IsString()
  qrToken: string;

  @ApiProperty({ description: 'Catatan tambahan siswa opsional', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class ManualAttendanceDto {
  @ApiProperty({ description: 'ID Siswa yang akan diupdate statusnya' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Tanggal absensi (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ enum: AttendanceStatus, description: 'Status absensi' })
  @IsNotEmpty()
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @ApiProperty({ description: 'Keterangan izin/sakit/alasan manual', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
