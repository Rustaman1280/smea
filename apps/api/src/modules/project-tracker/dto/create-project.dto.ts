import { IsNotEmpty, IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType, ProjectStatus } from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty({ description: 'Judul Proyek Kejuruan' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Deskripsi dan ruang lingkup proyek' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ProjectType, default: ProjectType.PROYEK_PRODUKTIF })
  @IsNotEmpty()
  @IsEnum(ProjectType)
  type: ProjectType;

  @ApiProperty({ description: 'Jurusan (misal: RPL, TKJ)' })
  @IsNotEmpty()
  @IsString()
  major: string;

  @ApiProperty({ description: 'ID Kelas' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ description: 'ID Guru Pembimbing' })
  @IsNotEmpty()
  @IsString()
  supervisorId: string;

  @ApiProperty({ description: 'Batas akhir target selesai proyek' })
  @IsNotEmpty()
  @IsDateString()
  deadline: string;

  @ApiProperty({ required: false, description: 'Repository GitHub' })
  @IsOptional()
  @IsString()
  githubUrl?: string;

  @ApiProperty({ required: false, description: 'Demo URL' })
  @IsOptional()
  @IsString()
  demoUrl?: string;
}
