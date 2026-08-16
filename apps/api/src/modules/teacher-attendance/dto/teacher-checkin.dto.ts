import { IsNotEmpty, IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TeacherAttendanceStatus } from '@prisma/client';

export class TeacherCheckInDto {
  @ApiProperty({ enum: TeacherAttendanceStatus, default: TeacherAttendanceStatus.HADIR })
  @IsNotEmpty()
  @IsEnum(TeacherAttendanceStatus)
  status: TeacherAttendanceStatus;

  @ApiProperty({ required: false, description: 'Latitude GPS' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, description: 'Longitude GPS' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false, description: 'Catatan dinas luar / izin / surat' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, description: 'URL foto selfie / bukti kehadiran' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class CreateTeachingSessionDto {
  @ApiProperty({ description: 'Nama Mata Pelajaran' })
  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @ApiProperty({ description: 'Nama Kelas (misal: XII RPL 1)' })
  @IsNotEmpty()
  @IsString()
  className: string;

  @ApiProperty({ description: 'Jam ke mulai (misal: 1)' })
  @IsNotEmpty()
  @IsNumber()
  startPeriod: number;

  @ApiProperty({ description: 'Jam ke selesai (misal: 3)' })
  @IsNotEmpty()
  @IsNumber()
  endPeriod: number;

  @ApiProperty({ description: 'Topik / Materi yang diajarkan' })
  @IsNotEmpty()
  @IsString()
  topicTaught: string;

  @ApiProperty({ description: 'Jumlah siswa yang hadir di kelas' })
  @IsNotEmpty()
  @IsNumber()
  studentCount: number;
}
