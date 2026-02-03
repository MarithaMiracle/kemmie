import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../repositories/prisma.repository';
import { MoodService } from './mood.service';

type PrismaMood = 'GOOD' | 'OKAY' | 'LOW' | 'STRESSED';

@Injectable()
export class VibeCheckService {
  constructor(private prisma: PrismaService, private mood: MoodService) {}

  async record(relationshipId: string, userId: string, mood: PrismaMood) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const checkIn = await this.prisma.checkIn.upsert({
      where: { relationshipId_userId_date: { relationshipId, userId, date } },
      update: { mood },
      create: { relationshipId, userId, date, mood }
    });
    const partnerMembership = await this.prisma.relationshipMember.findFirst({
      where: { relationshipId, userId: { not: userId } }
    });
    let response: string | null = null;
    if (partnerMembership) {
      const res = await this.prisma.checkInResponse.findFirst({
        where: { relationshipId, authorId: partnerMembership.userId, mood }
      });
      response = res ? res.content : null;
    }
    return { checkIn, response };
  }

  async today(relationshipId: string, userId: string) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return this.prisma.checkIn.findUnique({
      where: { relationshipId_userId_date: { relationshipId, userId, date } }
    });
  }




  async recordByLabel(relationshipId: string, userId: string, moodLabel: string) {
    const mood = this.mood.fromLabel(moodLabel);
    return this.record(relationshipId, userId, mood);
  }

  async todaySummary(relationshipId: string) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
    const items = await Promise.all(members.map(async (m) => {
      const ci = await this.prisma.checkIn.findUnique({
        where: { relationshipId_userId_date: { relationshipId, userId: m.userId, date } }
      });
      return {
        author: m.user?.name || 'Unknown',
        mood: this.mood.toLabel(ci?.mood as PrismaMood || null),
        text: '',
        time: 'Today'
      };
    }));
    return items;
  }
}