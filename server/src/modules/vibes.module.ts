import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VibesController } from '../controllers/vibes.controller';
import { VibesService } from '../services/vibes.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [VibesController],
  providers: [VibesService]
})
export class VibesModule {}