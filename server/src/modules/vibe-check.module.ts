import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VibeCheckController } from '../controllers/vibe-check.controller';
import { VibeCheckService } from '../services/vibe-check.service';
import { MoodService } from '../services/mood.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [VibeCheckController],
  providers: [VibeCheckService, MoodService],
  exports: [VibeCheckService, MoodService]
})
export class VibeCheckModule {}