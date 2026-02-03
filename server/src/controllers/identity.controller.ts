import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { IdentityService } from '../services/identity.service';

@ApiTags('Identity')
@ApiBearerAuth()
@Controller('identity')
@UseGuards(AuthGuard('jwt'))
export class IdentityController {
  constructor(private service: IdentityService) {}

  @Get('names')
  async names(@Req() req: any) {
    return this.service.names(req.user.userId, req.user.relationshipId);
  }
}