import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AchievementsController } from '../controllers/achievements.controller';
import { AchievementsService } from '../services/achievements.service';
import { StreaksModule } from './streaks.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), StreaksModule],
  controllers: [AchievementsController],
  providers: [AchievementsService]
})
export class AchievementsModule {}