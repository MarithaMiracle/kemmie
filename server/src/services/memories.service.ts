import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

type MemType = 'PHOTO' | 'VIDEO';

@Injectable()
export class MemoriesService {
  constructor(private prisma: PrismaService) {}

  async stats(relationshipId: string) {
    const photos = await this.prisma.memory.count({ where: { relationshipId, type: 'PHOTO' } });
    const videos = await this.prisma.memory.count({ where: { relationshipId, type: 'VIDEO' } });
    const favorites = await this.prisma.memory.count({ where: { relationshipId, favorite: true } });
    return { photos, videos, total: photos + videos, favorites };
  }

  async add(relationshipId: string, authorId: string, type: MemType, url: string, mimeType?: string) {
    if (!['PHOTO', 'VIDEO'].includes(type)) throw new BadRequestException('invalid_type');
    if (!url) throw new BadRequestException('invalid_url');
    return this.prisma.memory.create({ data: { relationshipId, authorId, type, url, mimeType } });
  }

  async list(relationshipId: string, params: { type?: MemType; favorite?: boolean; limit?: number; cursor?: string }) {
    const where: any = { relationshipId };
    if (params.type) where.type = params.type;
    if (typeof params.favorite === 'boolean') where.favorite = params.favorite;
    const take = params.limit ?? 50;
    return this.prisma.memory.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(params.cursor ? { skip: 1, cursor: { id: params.cursor } } : {})
    });
  }

  async setFavorite(relationshipId: string, id: string, favorite: boolean) {
    const mem = await this.prisma.memory.findFirst({ where: { id, relationshipId } });
    if (!mem) throw new BadRequestException('not_found');
    return this.prisma.memory.update({ where: { id }, data: { favorite } });
  }

  async remove(relationshipId: string, id: string) {
    const mem = await this.prisma.memory.findFirst({ where: { id, relationshipId } });
    if (!mem) throw new BadRequestException('not_found');
    return this.prisma.memory.delete({ where: { id } });
  }
}