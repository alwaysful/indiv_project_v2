import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  // 리프레시 토큰 해시 저장/폐기(null). 사용자가 없어도 예외 없이 통과
  updateRefreshTokenHash(
    id: number,
    refreshTokenHash: string | null,
  ): Promise<Prisma.BatchPayload> {
    return this.prisma.user.updateMany({
      where: { id },
      data: { refreshTokenHash },
    });
  }
}
