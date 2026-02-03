import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HomeService } from '../services/home.service';

@ApiTags('Home')
@ApiBearerAuth()
@Controller('home')
@UseGuards(AuthGuard('jwt'))
export class HomeController {
  constructor(private service: HomeService) {}

  @Get('summary')
  async summary(@Req() req: any) {
    return this.service.summary(req.user.relationshipId, req.user.userId);
  }
}