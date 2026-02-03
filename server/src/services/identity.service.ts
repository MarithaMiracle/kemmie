import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Injectable()
export class IdentityService {
  constructor(private prisma: PrismaService) {}

  async names(userId: string, relationshipId: string) {
    const members = await this.prisma.relationshipMember.findMany({
      where: { relationshipId },
      include: { user: { select: { id: true, name: true } } }
    });
    const me = members.find(m => m.userId === userId)?.user?.name || 'You';
    const partner = members.find(m => m.userId !== userId)?.user?.name || 'Bestie';
    return { currentUserName: me, bestieName: partner };
  }
}