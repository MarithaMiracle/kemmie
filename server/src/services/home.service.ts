import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';
import { VibeCheckService } from './vibe-check.service';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService, private vibeCheck: VibeCheckService) {}

  private toDayKey(d: Date) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString();
  }

  async summary(relationshipId: string, userId: string) {
    const members = await this.prisma.relationshipMember.findMany({
      where: { relationshipId },
      include: { user: { select: { id: true, name: true } } }
    });
    const me = members.find(m => m.userId === userId)?.user?.name || 'You';
    const partner = members.find(m => m.userId !== userId)?.user?.name || 'Bestie';

    const today = new Date(); today.setHours(0,0,0,0);
    const relationship = await this.prisma.relationship.findUnique({ where: { id: relationshipId } });
    const recent = await this.prisma.checkIn.findMany({
      where: { relationshipId, date: { lte: today } },
      orderBy: { date: 'desc' },
      take: 120
    });
    const daySet = new Set(recent.map(ci => this.toDayKey(ci.date)));
    let streak = 0;
    for (let i = 0; i < 120; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      if (daySet.has(this.toDayKey(d))) streak++; else break;
    }

    const lastActiveSeconds = recent.length ? Math.max(0, Math.floor((Date.now() - new Date(recent[0].date).getTime()) / 1000)) : 0;
    const relationshipAgeDays = relationship ? Math.max(0, Math.floor((today.getTime() - new Date(relationship.createdAt).getTime()) / (1000 * 60 * 60 * 24))) : 0;

    const messagesCount = await this.prisma.message.count({ where: { relationshipId } });
    const memoriesCount = await this.prisma.memory.count({ where: { relationshipId } });
    const todayVibeCheck = await this.vibeCheck.todaySummary(relationshipId);

    // Hardcoded Birthday for Kemmie: December 21
    const bday = new Date(today.getFullYear(), 11, 21); // Month is 0-indexed (11 = December)
    if (bday < today) bday.setFullYear(today.getFullYear() + 1);
    const diffTime = bday.getTime() - today.getTime();
    const daysToGo = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const nextBirthday = { name: 'Kemmie', daysToGo };

    return { 
      currentUserName: me, 
      bestieName: partner, 
      streak, 
      messagesCount, 
      memoriesCount, 
      todayVibeCheck, 
      relationshipAgeDays, 
      lastActiveSeconds,
      nextBirthday
    };
  }
}