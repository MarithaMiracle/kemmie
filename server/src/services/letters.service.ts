
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Injectable()
export class LettersService {
  constructor(private prisma: PrismaService) {}

  async createLetter(relationshipId: string, authorId: string, content: string, unlockDate: Date) {
    return this.prisma.letter.create({ data: { relationshipId, authorId, content, unlockDate } });
  }

  async getLetterForDate(relationshipId: string, date: Date) {
    const start = new Date(date);
    const end = new Date(date);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return this.prisma.letter.findFirst({ where: { relationshipId, unlockDate: { gte: start, lte: end } } });
  }

  async getToday(relationshipId: string) {
    const unlockHour = Number(process.env.LETTER_UNLOCK_HOUR || 7);
    const now = new Date();
    const todayUnlock = new Date();
    todayUnlock.setHours(unlockHour, 0, 0, 0);
    const letter = await this.getLetterForDate(relationshipId, now);
    const unlocked = now.getTime() >= todayUnlock.getTime();
    const unlockInSeconds = unlocked ? 0 : Math.max(0, Math.floor((todayUnlock.getTime() - now.getTime()) / 1000));
    return { letter: unlocked ? letter : null, unlocked, unlockInSeconds };
  }

  async markRead(letterId: string) {
    return this.prisma.letter.update({ where: { id: letterId }, data: { readAt: new Date() } });
  }
}