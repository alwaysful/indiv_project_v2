import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('signup')
  signup(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    return this.auth.signup(body.email, body.password, body.username);
  }

  @Post('login')
  login(@Body() body: LoginDto): Promise<TokenResponseDto> {
    return this.auth.login(body.email, body.password);
  }
}
