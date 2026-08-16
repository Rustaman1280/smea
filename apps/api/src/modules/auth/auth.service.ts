import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto, RefreshTokenDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
      include: {
        student: {
          include: {
            class: {
              include: { major: true },
            },
          },
        },
        teacher: {
          include: {
            homeroomClass: true,
          },
        },
        staff: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Akun ini telah dinonaktifkan oleh Administrator');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email/Username atau password salah');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Save hashed refresh token
    const hashedRt = await bcrypt.hash(tokens.refreshToken, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRt },
    });

    const { password: _, refreshToken: __, ...userProfile } = user;

    return {
      user: userProfile,
      ...tokens,
    };
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const payload = this.jwtService.verify(dto.refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'superapp-smkn1garut-refresh-key-2026',
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Sesi tidak valid');
      }

      const rtMatches = await bcrypt.compare(dto.refreshToken, user.refreshToken);
      if (!rtMatches) {
        throw new UnauthorizedException('Refresh token tidak cocok');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      const hashedRt = await bcrypt.hash(tokens.refreshToken, 10);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRt },
      });

      return tokens;
    } catch {
      throw new UnauthorizedException('Token refresh kadaluarsa atau tidak valid');
    }
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
    return { success: true, message: 'Berhasil keluar dari sistem' };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: {
          include: {
            class: {
              include: { major: true },
            },
          },
        },
        teacher: {
          include: {
            homeroomClass: true,
          },
        },
        staff: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Pengguna tidak ditemukan');
    }

    const { password, refreshToken, ...profile } = user;
    return profile;
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload = { sub: userId, email, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET || 'superapp-smkn1garut-secret-key-2026',
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'superapp-smkn1garut-refresh-key-2026',
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 24 hours
    };
  }
}
