
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Injectable()
export class ComfortService {
  constructor(private prisma: PrismaService) {}

  async nextMessage(relationshipId: string) {
    let state = await this.prisma.comfortState.findFirst({ where: { relationshipId }, orderBy: { cycleId: 'desc' } });
    if (!state) state = await this.prisma.comfortState.create({ data: { relationshipId } });
    const all = await this.prisma.comfortMessage.findMany({ where: { relationshipId } });
    if (all.length === 0) return { message: null };
    const used = await this.prisma.comfortStateUsed.findMany({ where: { comfortStateId: state.id } });
    const usedIds = new Set(used.map(u => u.messageId));
    const remaining = all.filter(m => !usedIds.has(m.id));
    if (remaining.length === 0) {
      state = await this.prisma.comfortState.create({ data: { relationshipId, cycleId: state.cycleId + 1 } });
      const next = all[Math.floor(Math.random() * all.length)];
      await this.prisma.comfortStateUsed.create({ data: { comfortStateId: state.id, messageId: next.id } });
      return { message: next.content, cycleId: state.cycleId };
    }
    const chosen = remaining[Math.floor(Math.random() * remaining.length)];
    await this.prisma.comfortStateUsed.create({ data: { comfortStateId: state.id, messageId: chosen.id } });
    return { message: chosen.content, cycleId: state.cycleId };
  }

  async addMessage(relationshipId: string, authorId: string, content: string) {
    return this.prisma.comfortMessage.create({ data: { relationshipId, authorId, content } });
  }
}