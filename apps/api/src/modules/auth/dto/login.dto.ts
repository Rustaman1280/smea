import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'siswa@smkn1garut.sch.id',
    description: 'Email atau username akun',
  })
  @IsNotEmpty({ message: 'Email/Username tidak boleh kosong' })
  @IsString()
  identifier: string;

  @ApiProperty({
    example: 'password123',
    description: 'Kata sandi pengguna',
  })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token yang diperoleh saat login',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
