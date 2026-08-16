import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'ID Mata Pelajaran' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ description: 'ID Kelas' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ description: 'Judul Tugas / Praktikum' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Deskripsi soal dan instruksi pengerjaan' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Batas akhir pengumpulan (YYYY-MM-DDTHH:mm:ss)' })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @ApiProperty({ default: 100, description: 'Nilai maksimal' })
  @IsOptional()
  @IsNumber()
  maxScore?: number;
}

export class SubmitAssignmentDto {
  @ApiProperty({ description: 'ID Tugas' })
  @IsNotEmpty()
  @IsString()
  assignmentId: string;

  @ApiProperty({ required: false, description: 'Link GitHub / Google Drive / URL Demo' })
  @IsOptional()
  @IsString()
  submissionUrl?: string;

  @ApiProperty({ required: false, description: 'Catatan pengumpulan dari siswa' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class GradeSubmissionDto {
  @ApiProperty({ description: 'Nilai tugas (0 - 100)' })
  @IsNotEmpty()
  @IsNumber()
  score: number;

  @ApiProperty({ required: false, description: 'Umpan balik / feedback guru' })
  @IsOptional()
  @IsString()
  feedback?: string;
}
