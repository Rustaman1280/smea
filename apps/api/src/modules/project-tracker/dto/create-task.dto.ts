import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskColumn, TaskPriority } from '@prisma/client';

export class CreateProjectTaskDto {
  @ApiProperty({ description: 'ID Proyek' })
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @ApiProperty({ description: 'Judul Tugas / Modul Fitur' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'Detail instruksi tugas' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'Nama anggota pelaksana' })
  @IsOptional()
  @IsString()
  assigneeName?: string;

  @ApiProperty({ enum: TaskColumn, default: TaskColumn.TODO })
  @IsOptional()
  @IsEnum(TaskColumn)
  column?: TaskColumn;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;
}

export class MoveTaskColumnDto {
  @ApiProperty({ enum: TaskColumn, description: 'Kolom tujuan (TODO, IN_PROGRESS, REVIEW, DONE)' })
  @IsNotEmpty()
  @IsEnum(TaskColumn)
  column: TaskColumn;
}

export class CreatePklJournalDto {
  @ApiProperty({ description: 'Nama Perusahaan / DUDI tempat PKL' })
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty({ description: 'Tanggal kegiatan PKL (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Uraian aktivitas pekerjaan industri hari ini' })
  @IsNotEmpty()
  @IsString()
  activityDescription: string;

  @ApiProperty({ description: 'Kompetensi kejuruan yang dipelajari' })
  @IsNotEmpty()
  @IsString()
  competencyLearned: string;

  @ApiProperty({ required: false, description: 'Foto dokumentasi kegiatan' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}
