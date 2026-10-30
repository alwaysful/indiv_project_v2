import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { AuthService } from './auth.service';
import { AuthUser, CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from './jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @ApiOperation({ summary: '회원가입' })
  @ApiCreatedResponse({ description: '가입 성공', type: UserResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: '이미 가입된 이메일',
    type: ErrorResponseDto,
  })
  @Post('signup')
  signup(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.auth.signup(body.email, body.password, body.username);
  }

  @ApiOperation({ summary: '로그인 (accessToken + refreshToken 발급)' })
  @ApiOkResponse({ description: '로그인 성공', type: TokenResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '이메일 또는 비밀번호 불일치',
    type: ErrorResponseDto,
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto): Promise<TokenResponseDto> {
    return this.auth.login(body.email, body.password);
  }

  @ApiOperation({
    summary: '토큰 재발급 (refresh token rotation)',
    description:
      '유효한 리프레시 토큰으로 새 accessToken/refreshToken 을 발급합니다. 기존 리프레시 토큰은 즉시 폐기되며, 이미 사용된 토큰을 다시 보내면 세션이 폐기됩니다.',
  })
  @ApiOkResponse({ description: '재발급 성공', type: TokenResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '유효하지 않거나 만료/폐기된 리프레시 토큰',
    type: ErrorResponseDto,
  })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Body() body: RefreshTokenDto): Promise<TokenResponseDto> {
    return this.auth.refresh(body.refreshToken);
  }

  @ApiOperation({ summary: '로그아웃 (리프레시 토큰 폐기)' })
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: '로그아웃 성공' })
  @ApiUnauthorizedResponse({
    description: '인증 실패',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@CurrentUser() user: AuthUser): Promise<void> {
    return this.auth.logout(user.id);
  }
}
