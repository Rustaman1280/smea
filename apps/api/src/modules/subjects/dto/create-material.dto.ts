import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialDto {
  @ApiProperty({ description: 'ID Mata Pelajaran' })
  @IsNotEmpty()
  @IsString()
  subjectId: string;

  @ApiProperty({ description: 'ID Kelas' })
  @IsNotEmpty()
  @IsString()
  classId: string;

  @ApiProperty({ description: 'Judul Modul / Materi Pembelajaran' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ required: false, description: 'Ringkasan / petunjuk belajar' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false, description: 'URL file dokumen / PDF' })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ required: false, description: 'Tautan video YouTube / artikel eksternal' })
  @IsOptional()
  @IsString()
  linkUrl?: string;
}
