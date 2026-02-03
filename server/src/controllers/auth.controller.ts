
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../constants/requests/auth/login.request';
import { RegisterRequestDto } from '../constants/requests/auth/register.request';
import { LoginResponseDto } from '../constants/responses/auth/login.response';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleInit() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOkResponse({ type: LoginResponseDto })
  async googleCallback(@Req() req: any): Promise<LoginResponseDto> {
    return this.authService.oauthGoogle(req.user?.email, req.user?.name);
  }

  @Post('google/mobile')
  @ApiOkResponse({ type: LoginResponseDto })
  async googleMobile(@Body() body: { idToken: string }): Promise<LoginResponseDto> {
    return this.authService.googleMobile(body.idToken);
  }

  @Post('register')
  @ApiOkResponse({ type: LoginResponseDto })
  async register(@Body() body: RegisterRequestDto): Promise<LoginResponseDto> {
    return this.authService.register(body.email, body.password, body.name, body.birthday, body.inviteCode);
  }

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(body.email, body.password);
  }
}