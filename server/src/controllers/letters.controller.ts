
import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { LettersService } from '../services/letters.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateLetterRequestDto } from '../constants/requests/letters/create.request';

@ApiTags('Letters')
@ApiBearerAuth()
@Controller('letters')
@UseGuards(AuthGuard('jwt'))
export class LettersController {
  constructor(private service: LettersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateLetterRequestDto) {
    return this.service.createLetter(req.user.relationshipId, req.user.userId, dto.content, new Date(dto.unlockDate));
  }

  @Get('today')
  today(@Req() req: any) {
    return this.service.getToday(req.user.relationshipId);
  }

  @Get(':date')
  byDate(@Req() req: any, @Param('date') date: string) {
    return this.service.getLetterForDate(req.user.relationshipId, new Date(date));
  }

  @Patch(':id/read')
  read(@Param('id') id: string) {
    return this.service.markRead(id);
  }
}