import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createHash, randomUUID, timingSafeEqual } from 'crypto';
import { User } from '../../generated/prisma/client';
import { AuthRepository } from './auth.repository';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

type JwtRefreshPayload = {
  sub: number;
  email: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds: number;
  private readonly refreshSecret: string;
  private readonly refreshExpiresIn: JwtSignOptions['expiresIn'];

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS') ?? 10);
    this.refreshSecret = this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
    // 예: 1h, 30m, 7d (단위 필수). 미설정 시 7d
    const refreshExpiresIn =
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    this.refreshExpiresIn = refreshExpiresIn as JwtSignOptions['expiresIn'];
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // 로컬 회원가입
  async signup(
    email: string,
    password: string,
    username?: string,
  ): Promise<UserResponseDto> {
    const normalized = this.normalizeEmail(email);

    const exists = await this.authRepository.findByEmail(normalized);
    if (exists) {
      throw new ConflictException('이미 가입된 이메일입니다.');
    }

    const hashed = await bcrypt.hash(password, this.saltRounds);
    const user = await this.authRepository.create({
      email: normalized,
      username,
      password: hashed,
    });

    this.logger.log(`회원가입: userId=${user.id}`);
    return UserResponseDto.from(user);
  }

  // 로컬 로그인
  async login(email: string, password: string): Promise<TokenResponseDto> {
    const user = await this.authRepository.findByEmail(
      this.normalizeEmail(email),
    );

    // 이메일/비밀번호 어느 쪽이 틀렸는지 노출하지 않음
    const ok = user && (await bcrypt.compare(password, user.password));
    if (!user || !ok) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 올바르지 않습니다.',
      );
    }

    return this.issueTokens(user);
  }

  // 리프레시 토큰 검증 후 access/refresh 토큰 재발급 (refresh token rotation)
  async refresh(refreshToken: string): Promise<TokenResponseDto> {
    const invalid = new UnauthorizedException(
      '유효하지 않거나 만료된 리프레시 토큰입니다.',
    );

    let payload: JwtRefreshPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtRefreshPayload>(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch {
      throw invalid;
    }

    const user = await this.authRepository.findById(payload.sub);
    if (!user?.refreshTokenHash) {
      throw invalid;
    }

    const incoming = this.hashToken(refreshToken);
    if (!this.isSameHash(user.refreshTokenHash, incoming)) {
      // 이미 교체된(사용된) 토큰의 재사용 → 탈취 가능성이 있으므로 세션 폐기
      await this.authRepository.updateRefreshTokenHash(user.id, null);
      this.logger.warn(`리프레시 토큰 재사용 감지: userId=${user.id}`);
      throw invalid;
    }

    return this.issueTokens(user);
  }

  // 로그아웃: 저장된 리프레시 토큰 폐기
  async logout(userId: number): Promise<void> {
    await this.authRepository.updateRefreshTokenHash(userId, null);
  }

  private async issueTokens(user: User): Promise<TokenResponseDto> {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload),
      this.jwt.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
        // 같은 초에 발급돼도 토큰이 겹치지 않도록 고유 ID 부여
        jwtid: randomUUID(),
      }),
    ]);

    await this.authRepository.updateRefreshTokenHash(
      user.id,
      this.hashToken(refreshToken),
    );
    return { accessToken, refreshToken };
  }

  // JWT 는 bcrypt 입력 한도(72byte)를 넘기므로 SHA-256 으로 해시한다.
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private isSameHash(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }
}
