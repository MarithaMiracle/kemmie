
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';
import { MessageType } from '../constants/enums/message-type.enum';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async send(relationshipId: string, senderId: string, content: string, type: MessageType, replyToId?: string) {
    return this.prisma.message.create({ data: { relationshipId, senderId, content, type, replyToId } });
  }

  async react(messageId: string, userId: string, value: string) {
    return this.prisma.messageReaction.upsert({
      where: { messageId_userId_value: { messageId, userId, value } },
      update: {},
      create: { messageId, userId, value }
    });
  }

  async edit(messageId: string, userId: string, content: string) {
    return this.prisma.message.update({ where: { id: messageId }, data: { content, editedAt: new Date() } });
  }

  async delete(messageId: string, userId: string) {
    return this.prisma.message.update({ where: { id: messageId }, data: { deletedAt: new Date() } });
  }

  async pin(messageId: string, userId: string, pinned: boolean) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { pinned },
      select: { id: true, pinned: true }
    });
  }

  async restore(messageId: string, userId: string) {
    return this.prisma.message.update({ where: { id: messageId }, data: { deletedAt: null } });
  }

  async unpinAll(relationshipId: string) {
    return this.prisma.message.updateMany({ where: { relationshipId }, data: { pinned: false } });
  }

  async list(relationshipId: string, take = 50, cursor?: string) {
    return this.prisma.message.findMany({
      where: { relationshipId, deletedAt: null },
      include: { replyTo: { select: { id: true, content: true, senderId: true } } },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });
  }

  async count(relationshipId: string) {
    return this.prisma.message.count({ where: { relationshipId } });
  }
}