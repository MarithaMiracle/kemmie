
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ComfortService } from '../services/comfort.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateMessageRequestDto } from '../constants/requests/comfort/create-message.request';
import { NextComfortResponseDto } from '../constants/responses/comfort/next.response';

@ApiTags('Bad Day')
@ApiBearerAuth()
@Controller('bad-day')
@UseGuards(AuthGuard('jwt'))
export class ComfortController {
  constructor(private service: ComfortService) {}

  @Post()
  @ApiOkResponse({ type: NextComfortResponseDto })
  next(@Req() req: any) {
    return this.service.nextMessage(req.user.relationshipId);
  }

  @Post('messages')
  add(@Req() req: any, @Body() dto: CreateMessageRequestDto) {
    return this.service.addMessage(req.user.relationshipId, req.user.userId, dto.content);
  }
}