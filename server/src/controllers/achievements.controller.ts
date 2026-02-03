import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AchievementsService } from '../services/achievements.service';

@ApiTags('Achievements')
@ApiBearerAuth()
@Controller('achievements')
@UseGuards(AuthGuard('jwt'))
export class AchievementsController {
  constructor(private service: AchievementsService) {}

  @Get()
  async list(@Req() req: any) {
    return this.service.list(req.user.relationshipId);
  }
}