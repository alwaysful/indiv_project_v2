import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ConfigService } from '@nestjs/config';

// 검증을 통과한 값만 쓴다는 의미로 두 번째 제네릭에 true
type AppConfig = ConfigService<true>;

function toInt(value: unknown, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new Error(`환경변수 ${name} 는 정수여야 합니다: ${String(value)}`);
  }
  return n;
}

// 유저가 없을 때도 bcrypt 비교를 수행해 응답 시간 차이를 줄이기 위한 더미 해시
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 10);

function isUniqueViolation(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
  );
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds: number;

  constructor(
    private authRepository: AuthRepository,
    private jwt: JwtService,
    private readonly config: AppConfig,
  ) {
    this.saltRounds = toInt(
      this.config.get('BCRYPT_SALT_ROUNDS', { infer: true }),
      'BCRYPT_SALT_ROUNDS',
    );
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
    const hashed = await bcrypt.hash(password, 10);

  // 로컬 로그인
  async login(email: string, password: string): Promise<TokenResponseDto> {
    const user = await this.authRepository.findByEmail(
      this.normalizeEmail(email),
    );
    return this.generateJwt(user);
  }
}
