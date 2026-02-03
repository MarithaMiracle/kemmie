import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VibeCheckService } from '../services/vibe-check.service';

@ApiTags('Vibe Check')
@ApiBearerAuth()
@Controller('vibe-check')
@UseGuards(AuthGuard('jwt'))
export class VibeCheckController {
  constructor(private service: VibeCheckService) {}

  @Get('today/summary')
  async todaySummary(@Req() req: any) {
    return this.service.todaySummary(req.user.relationshipId);
  }

  @Post()
  async record(@Req() req: any, @Body() body: { moodLabel: string; content?: string }) {
    return this.service.recordByLabel(req.user.relationshipId, req.user.userId, body.moodLabel);
  }
}