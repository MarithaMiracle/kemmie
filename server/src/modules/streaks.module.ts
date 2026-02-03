import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { StreaksController } from '../controllers/streaks.controller';
import { StreaksService } from '../services/streaks.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [StreaksController],
  providers: [StreaksService],
  exports: [StreaksService]
})
export class StreaksModule {}