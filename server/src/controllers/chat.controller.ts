import { Controller, Get, Post, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from '../services/chat.service';
import { ChatGateway } from '../gateways/chat.gateway';
import { MessageType } from '../constants/enums/message-type.enum';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chat: ChatService, private gateway: ChatGateway) {}

  @Get('messages')
  async messages(@Req() req: any, @Query('limit') limit = '50', @Query('cursor') cursor?: string) {
    const list = await this.chat.list(req.user.relationshipId, Number(limit), cursor);
    return list.map(m => ({
      id: m.id,
      text: m.content,
      sender: m.senderId === req.user.userId ? 'me' : 'them',
      createdAt: m.createdAt.toISOString(),
      timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      pinned: !!(m as any).pinned,
      replyToId: (m as any).replyToId || null,
      editedAt: (m as any).editedAt ? (m as any).editedAt.toISOString() : undefined,
      replyTo: (m as any).replyTo ? { id: (m as any).replyTo.id, text: (m as any).replyTo.content, sender: ((m as any).replyTo.senderId === req.user.userId ? 'me' : 'them') } : undefined,
    }));
  }

  @Get('stats')
  async stats(@Req() req: any) {
    const messagesCount = await this.chat.count(req.user.relationshipId);
    return { messagesCount };
  }

  @Post('messages')
  async send(@Req() req: any, @Body() body: { content: string; type?: MessageType; replyToId?: string }) {
    const msg = await this.chat.send(
      req.user.relationshipId,
      req.user.userId,
      body.content,
      (body.type || 'TEXT') as MessageType,
      body.replyToId
    );
    this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:new', msg);
    return {
      id: msg.id,
      text: msg.content,
      sender: msg.senderId === req.user.userId ? 'me' : 'them',
      createdAt: msg.createdAt.toISOString(),
      timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      pinned: !!(msg as any).pinned,
      replyToId: (msg as any).replyToId || null,
      replyTo: (msg as any).replyTo ? { id: (msg as any).replyTo.id, text: (msg as any).replyTo.content, sender: ((msg as any).replyTo.senderId === req.user.userId ? 'me' : 'them') } : undefined,
    };
  }

  @Post('reactions')
  async react(@Req() req: any, @Body() body: { messageId: string; value: string }) {
    const r = await this.chat.react(body.messageId, req.user.userId, body.value);
    this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:reaction', r);
    return r;
  }

  @Patch('messages/:id')
  async edit(@Req() req: any, @Param('id') id: string, @Body() body: { content: string }) {
    const updated = await this.chat.edit(id, req.user.userId, body.content);
    return {
      id: updated.id,
      text: updated.content,
      sender: updated.senderId === req.user.userId ? 'me' : 'them',
      createdAt: updated.createdAt.toISOString(),
      timestamp: new Date(updated.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      pinned: !!(updated as any).pinned,
      replyToId: (updated as any).replyToId || null,
      editedAt: (updated as any).editedAt ? (updated as any).editedAt.toISOString() : undefined,
    };
  }

  @Delete('messages/:id')
  async remove(@Req() req: any, @Param('id') id: string) {
    await this.chat.delete(id, req.user.userId);
    return { id };
  }

  @Patch('messages/:id/pin')
  async pin(@Req() req: any, @Param('id') id: string, @Body() body: { pinned: boolean }) {
    const updated = await this.chat.pin(id, req.user.userId, body.pinned);
    return { id: updated.id, pinned: !!updated.pinned };
  }

  @Patch('messages/:id/restore')
  async restore(@Req() req: any, @Param('id') id: string) {
    const updated = await this.chat.restore(id, req.user.userId);
    return { id: updated.id };
  }

  @Patch('messages/unpin-all')
  async unpinAll(@Req() req: any) {
    const res = await this.chat.unpinAll(req.user.relationshipId);
    return { count: (res as any).count ?? 0 };
  }
}