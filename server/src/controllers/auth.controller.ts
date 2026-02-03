
import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginResponseDto } from '../constants/responses/auth/login.response';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/mobile')
  @ApiOkResponse({ type: LoginResponseDto })
  async googleMobile(@Body() body: { idToken: string }): Promise<LoginResponseDto> {
    return this.authService.googleMobile(body.idToken);
  }
}