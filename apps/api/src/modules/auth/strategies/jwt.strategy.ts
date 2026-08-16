import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'superapp-smkn1garut-secret-key-2026',
    });
  }

  async validate(payload: { sub: string; email: string; role: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
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

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Pengguna tidak ditemukan atau akun dinonaktifkan');
    }

    const { password, refreshToken, ...result } = user;
    return result;
  }
}
