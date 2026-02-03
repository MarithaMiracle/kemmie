import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VibesService } from '../services/vibes.service';

@ApiTags('Vibes')
@ApiBearerAuth()
@Controller('vibes')
@UseGuards(AuthGuard('jwt'))
export class VibesController {
  constructor(private vibes: VibesService) {}

  @Get()
  async list(@Req() req: any, @Query('category') category?: string, @Query('authorName') authorName?: string, @Query('limit') limit?: string, @Query('cursor') cursor?: string) {
    return this.vibes.list(req.user.relationshipId, { category, authorName, limit: limit ? Number(limit) : undefined, cursor });
  }

  @Post()
  async add(@Req() req: any, @Body() body: { category: string; data: Record<string, any> }) {
    return this.vibes.add(req.user.relationshipId, req.user.userId, (body.category || '').toUpperCase() as any, body.data || {});
  }
}