import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma.module';
import { AuthModule } from './modules/auth.module';
import { VibeCheckModule } from './modules/vibe-check.module';
import { ChatModule } from './modules/chat.module';
import { IdentityModule } from './modules/identity.module';
import { HomeModule } from './modules/home.module';
import { VibesModule } from './modules/vibes.module';
import { StreaksModule } from './modules/streaks.module';
import { AchievementsModule } from './modules/achievements.module';
import { MemoriesModule } from './modules/memories.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JwtModule.register({ secret: process.env.JWT_SECRET || 'changeme', signOptions: { expiresIn: '7d' } }),
    AuthModule,
    VibeCheckModule,
    VibesModule,
    IdentityModule,
    HomeModule,
    ChatModule,
    StreaksModule,
    AchievementsModule,
    MemoriesModule
  ]
})
export class AppModule {}