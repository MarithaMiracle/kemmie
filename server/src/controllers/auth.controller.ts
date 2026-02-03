
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginResponseDto } from '../constants/responses/auth/login.response';
import { GoogleMobileLoginRequestDto } from '../constants/requests/auth/google-mobile.request';
import { DevLoginRequestDto } from '../constants/requests/auth/dev-login.request';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/mobile')
  @ApiOkResponse({ type: LoginResponseDto })
  async googleMobile(@Body() body: GoogleMobileLoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.googleMobile(body.idToken);
  }

  @Post('dev/login')
  @ApiOkResponse({ type: LoginResponseDto })
  async devLogin(@Body() body: DevLoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.devLogin(body.email);
  }
}