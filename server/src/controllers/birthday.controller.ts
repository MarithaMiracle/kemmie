
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { BirthdayService } from '../services/birthday.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CountdownResponseDto } from '../constants/responses/birthday/countdown.response';

@ApiTags('Birthday')
@ApiBearerAuth()
@Controller('birthday')
@UseGuards(AuthGuard('jwt'))
export class BirthdayController {
  constructor(private service: BirthdayService) {}

  @Get('countdown')
  @ApiOkResponse({ type: CountdownResponseDto })
  countdown(@Req() req: any) {
    return this.service.countdown(req.user.userId, req.user.relationshipId);
  }
}