import { IsNotEmpty, IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExtracurricularCategory, ClubMemberRole, ClubMemberStatus } from '@prisma/client';

export class CreateExtracurricularDto {
  @ApiProperty({ description: 'Nama Klub / Ekskul' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Deskripsi kegiatan ekskul' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ enum: ExtracurricularCategory, default: ExtracurricularCategory.TEKNOLOGI })
  @IsNotEmpty()
  @IsEnum(ExtracurricularCategory)
  category: ExtracurricularCategory;

  @ApiProperty({ description: 'Nama Pelatih / Pembina' })
  @IsNotEmpty()
  @IsString()
  coachName: string;

  @ApiProperty({ description: 'Hari latihan (misal: Kamis)' })
  @IsNotEmpty()
  @IsString()
  scheduleDay: string;

  @ApiProperty({ description: 'Jam latihan (misal: 15:30 - 17:30 WIB)' })
  @IsNotEmpty()
  @IsString()
  scheduleTime: string;

  @ApiProperty({ description: 'Tempat / Lokasi latihan di sekolah' })
  @IsNotEmpty()
  @IsString()
  location: string;
}

export class AddAchievementDto {
  @ApiProperty({ description: 'Judul Prestasi' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Nama Lomba / Kejuaraan' })
  @IsNotEmpty()
  @IsString()
  competition: string;

  @ApiProperty({ description: 'Tingkat (KABUPATEN, PROVINSI, NASIONAL, INTERNASIONAL)' })
  @IsNotEmpty()
  @IsString()
  level: string;

  @ApiProperty({ description: 'Peringkat Juara (misal: Juara 1)' })
  @IsNotEmpty()
  @IsString()
  rank: string;

  @ApiProperty({ description: 'Tahun perolehan' })
  @IsNotEmpty()
  @IsNumber()
  year: number;
}
