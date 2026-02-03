
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';
import { MessageType } from '../constants/enums/message-type.enum';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async send(relationshipId: string, senderId: string, content: string, type: MessageType) {
    return this.prisma.message.create({ data: { relationshipId, senderId, content, type } });
  }

  async react(messageId: string, userId: string, value: string) {
    return this.prisma.messageReaction.upsert({
      where: { messageId_userId_value: { messageId, userId, value } },
      update: {},
      create: { messageId, userId, value }
    });
  }

  async list(relationshipId: string, take = 50, cursor?: string) {
    return this.prisma.message.findMany({
      where: { relationshipId },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });
  }

  async count(relationshipId: string) {
    return this.prisma.message.count({ where: { relationshipId } });
  }
}