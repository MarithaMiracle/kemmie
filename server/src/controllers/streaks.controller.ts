import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StreaksService } from '../services/streaks.service';

@ApiTags('Streaks')
@ApiBearerAuth()
@Controller('streaks')
@UseGuards(AuthGuard('jwt'))
export class StreaksController {
  constructor(private service: StreaksService) {}

  @Get('summary')
  async summary(@Req() req: any) {
    return this.service.summary(req.user.relationshipId);
  }
}