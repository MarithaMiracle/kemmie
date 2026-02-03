import { Injectable } from '@nestjs/common';
import { StreaksService } from './streaks.service';

@Injectable()
export class AchievementsService {
  constructor(private streaks: StreaksService) {}

  async list(relationshipId: string) {
    const s = await this.streaks.summary(relationshipId);
    const d = s.streakDays;
    return [
      { key: 'week-warrior', title: 'Week Warrior', description: '7 day streak', icon: 'star', unlocked: d >= 7, remainingDays: Math.max(0, 7 - d) },
      { key: 'monthly-maven', title: 'Monthly Maven', description: '30 day streak', icon: 'award', unlocked: d >= 30, remainingDays: Math.max(0, 30 - d) },
      { key: 'legend-100', title: '100 Day Legend', description: '100 day streak', icon: 'trophy', unlocked: d >= 100, remainingDays: Math.max(0, 100 - d) }
    ];
  }
}