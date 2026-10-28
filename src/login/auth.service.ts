import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../../generated/prisma/client';
import { AuthRepository } from './auth.repository';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds: number;

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS') ?? 10);
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

    return this.generateJwt(user);
  }

  private async generateJwt(user: User): Promise<TokenResponseDto> {
    const accessToken = await this.jwt.signAsync({
      sub: user.id,
      email: user.email,
    });
    return { accessToken };
  }
}
