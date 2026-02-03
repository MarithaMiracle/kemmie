import { Controller, Get, Post, Body, Query, Req, UseGuards } from '@nestjs/common';
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
      timestamp: new Date(m.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    }));
  }

  @Get('stats')
  async stats(@Req() req: any) {
    const messagesCount = await this.chat.count(req.user.relationshipId);
    return { messagesCount };
  }

  @Post('messages')
  async send(@Req() req: any, @Body() body: { content: string; type?: MessageType }) {
    const msg = await this.chat.send(
      req.user.relationshipId,
      req.user.userId,
      body.content,
      (body.type || 'TEXT') as MessageType
    );
    this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:new', msg);
    return {
      id: msg.id,
      text: msg.content,
      sender: msg.senderId === req.user.userId ? 'me' : 'them',
      timestamp: new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };
  }

  @Post('reactions')
  async react(@Req() req: any, @Body() body: { messageId: string; value: string }) {
    const r = await this.chat.react(body.messageId, req.user.userId, body.value);
    this.gateway.server.to(`rel:${req.user.relationshipId}`).emit('message:reaction', r);
    return r;
  }
}