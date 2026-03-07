import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Body() body: { token?: string }, @Req() req: Request & { authToken?: string }) {
    const token = body?.token ?? req.authToken;
    if (token) await this.authService.logout(token);
  }

  @Post('me')
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: UserEntity) {
    return this.authService.toUserResponse(user);
  }
}
