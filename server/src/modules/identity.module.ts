import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { IdentityController } from '../controllers/identity.controller';
import { IdentityService } from '../services/identity.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [IdentityController],
  providers: [IdentityService]
})
export class IdentityModule {}