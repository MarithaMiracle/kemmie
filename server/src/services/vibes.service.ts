import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

type Cat = 'FOOD' | 'ACTIVITY' | 'MUSIC' | 'SHOPPING' | 'PLAN';

@Injectable()
export class VibesService {
  constructor(private prisma: PrismaService) {}

  private timeAgo(d: Date): string {
    const ms = Date.now() - new Date(d).getTime();
    const m = Math.floor(ms / 60000);
    if (m < 1) return 'Now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return 'Yesterday';
  }

  private toUI(v: any, name: string) {
    const t = this.timeAgo(v.createdAt);
    const data = v.data || {};
    switch (v.category) {
      case 'FOOD':
        return { emoji: data.emoji ?? '🍽️', text: data.text, type: data.type, time: t, author: name };
      case 'ACTIVITY':
        return { emoji: data.emoji ?? '🎉', text: data.text, type: data.type, time: t, author: name };
      case 'MUSIC':
        return { emoji: data.emoji ?? '🎵', artist: data.artist, song: data.song, status: data.status, time: t, author: name };
      case 'SHOPPING':
        return { emoji: data.emoji ?? '🛍️', item: data.item, store: data.store, priority: data.priority, author: name };
      case 'PLAN':
        return { emoji: data.emoji ?? '📍', plan: data.plan, date: data.date, location: data.location, author: name };
      default:
        return { emoji: '✨', text: data.text ?? '', time: t, author: name };
    }
  }

  async add(relationshipId: string, authorId: string, category: Cat, data: Record<string, any>) {
    if (!['FOOD','ACTIVITY','MUSIC','SHOPPING','PLAN'].includes(category)) {
      throw new BadRequestException('invalid_category');
    }
    return this.prisma.vibe.create({ data: { relationshipId, authorId, category, data } });
  }

  async list(relationshipId: string, params: { category?: string; authorName?: string; limit?: number; cursor?: string }) {
    const members = await this.prisma.relationshipMember.findMany({ where: { relationshipId }, include: { user: true } });
    const nameMap = new Map(members.map(m => [m.userId, m.user?.name || 'Unknown']));
    let authorId: string | undefined;
    if (params.authorName) {
      const m = members.find(x => (x.user?.name || '').toLowerCase() === params.authorName!.toLowerCase());
      authorId = m?.userId;
    }
    const where: any = { relationshipId };
    if (params.category) where.category = (params.category || '').toUpperCase();
    if (authorId) where.authorId = authorId;
    const take = params.limit ?? 50;
    const list = await this.prisma.vibe.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {})
    });
    return list.map(v => this.toUI(v, nameMap.get(v.authorId) || 'Unknown'));
  }
}