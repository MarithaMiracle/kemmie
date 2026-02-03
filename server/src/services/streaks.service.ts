import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  private toDayKey(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  }

  async summary(relationshipId: string) {
    const all = await this.prisma.checkIn.findMany({
      where: { relationshipId },
      orderBy: { date: 'asc' }
    });
    const dayKeys = Array.from(new Set(all.map(ci => this.toDayKey(ci.date))));
    const dates = dayKeys.map(k => new Date(k));
    const daySet = new Set(dayKeys);

    const today = new Date(); today.setHours(0,0,0,0);
    let streakDays = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      if (daySet.has(this.toDayKey(d))) streakDays++; else break;
    }

    let bestStreakDays = 0;
    let run = 0;
    for (let i = 0; i < dates.length; i++) {
      if (i === 0) { run = 1; bestStreakDays = Math.max(bestStreakDays, run); continue; }
      const prev = dates[i - 1];
      const cur = dates[i];
      const diff = Math.round((cur.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      run = diff === 1 ? run + 1 : 1;
      bestStreakDays = Math.max(bestStreakDays, run);
    }

    const dayIndex = (d: Date) => (d.getDay() + 6) % 7;
    const weekStart = new Date(today); weekStart.setDate(today.getDate() - dayIndex(today));
    const week: boolean[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
      week.push(daySet.has(this.toDayKey(d)));
    }

    const last = dates.length ? dates[dates.length - 1] : null;
    const lastActiveSeconds = last ? Math.max(0, Math.floor((new Date().getTime() - last.getTime()) / 1000)) : 0;

    return { streakDays, bestStreakDays, week, lastActiveSeconds };
  }
}