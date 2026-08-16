import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClubMemberStatus } from '@prisma/client';

export class JoinClubDto {
  @ApiProperty({ description: 'ID Klub Ekskul' })
  @IsNotEmpty()
  @IsString()
  clubId: string;
}

export class UpdateMemberStatusDto {
  @ApiProperty({ enum: ClubMemberStatus })
  @IsNotEmpty()
  @IsEnum(ClubMemberStatus)
  status: ClubMemberStatus;
}
