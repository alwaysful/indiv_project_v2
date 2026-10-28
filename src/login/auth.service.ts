import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

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
}