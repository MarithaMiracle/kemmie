import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MemoriesService } from '../services/memories.service';

@ApiTags('Memories')
@ApiBearerAuth()
@Controller('memories')
@UseGuards(AuthGuard('jwt'))
export class MemoriesController {
  constructor(private service: MemoriesService) {}

  @Get('stats')
  async stats(@Req() req: any) {
    return this.service.stats(req.user.relationshipId);
  }

  @Get()
  async list(
    @Req() req: any,
    @Query('type') type?: 'PHOTO' | 'VIDEO',
    @Query('favorite') favorite?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string
  ) {
    return this.service.list(req.user.relationshipId, {
      type: type as any,
      favorite: favorite === 'true' ? true : favorite === 'false' ? false : undefined,
      limit: limit ? Number(limit) : undefined,
      cursor
    });
  }

  @Post()
  async add(@Req() req: any, @Body() body: { type: 'PHOTO' | 'VIDEO'; url: string; mimeType?: string }) {
    return this.service.add(req.user.relationshipId, req.user.userId, body.type, body.url, body.mimeType);
  }

  @Patch(':id/favorite')
  async setFavorite(@Req() req: any, @Param('id') id: string, @Body() body: { favorite: boolean }) {
    return this.service.setFavorite(req.user.relationshipId, id, body.favorite);
  }

  @Delete(':id')
  async remove(@Req() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.relationshipId, id);
  }
}