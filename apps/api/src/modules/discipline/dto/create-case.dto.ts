import { IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ViolationSeverity, DisciplineCaseStatus } from '@prisma/client';

export class CreateDisciplineCaseDto {
  @ApiProperty({ description: 'ID Siswa yang melakukan pelanggaran' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ enum: ViolationSeverity, default: ViolationSeverity.RINGAN })
  @IsNotEmpty()
  @IsEnum(ViolationSeverity)
  category: ViolationSeverity;

  @ApiProperty({ description: 'Judul pelanggaran (misal: Terlambat Masuk 3x)' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Kronologi detail pelanggaran' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Bobot poin pelanggaran (misal: 5, 10, 25)' })
  @IsNotEmpty()
  @IsNumber()
  points: number;

  @ApiProperty({ description: 'Perlu surat panggilan orang tua?', default: false })
  @IsOptional()
  @IsBoolean()
  needsParentSummons?: boolean;

  @ApiProperty({ required: false, description: 'Tanggal jadwal panggilan orang tua' })
  @IsOptional()
  @IsDateString()
  parentSummonsDate?: string;
}

export class CreateCounselingSessionDto {
  @ApiProperty({ description: 'ID Siswa yang dikonseling' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ required: false, description: 'ID Kasus pelanggaran terkait' })
  @IsOptional()
  @IsString()
  caseId?: string;

  @ApiProperty({ description: 'Tanggal & Jam Sesi Konseling' })
  @IsNotEmpty()
  @IsDateString()
  sessionDate: string;

  @ApiProperty({ description: 'Catatan hasil bimbingan & konseling' })
  @IsNotEmpty()
  @IsString()
  notes: string;

  @ApiProperty({ description: 'Rencana tindak lanjut bimbingan' })
  @IsNotEmpty()
  @IsString()
  followUpPlan: string;
}
