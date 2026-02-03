
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Injectable()
export class BirthdayService {
  constructor(private prisma: PrismaService) {}

  async countdown(userId: string, relationshipId: string) {
    const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
    const partner = members.find(m => m.userId !== userId)?.user || null;
    if (!partner || !partner.birthday) return { daysUntil: null, message: 'Still counting.', targetDate: null };
    const now = new Date();
    const b = new Date(partner.birthday);
    const next = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (next < now) next.setFullYear(now.getFullYear() + 1);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const ms = next.getTime() - today.getTime();
    const daysUntil = Math.ceil(ms / (1000 * 60 * 60 * 24));
    const messages = ['Still counting.', 'I already know what I’m grateful for.', 'Worth the wait.'];
    const message = messages[daysUntil % messages.length];
    return { daysUntil, message, targetDate: next };
  }
}