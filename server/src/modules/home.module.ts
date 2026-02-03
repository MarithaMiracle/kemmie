import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { HomeController } from '../controllers/home.controller';
import { HomeService } from '../services/home.service';
import { VibeCheckModule } from './vibe-check.module';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }), VibeCheckModule],
  controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}