
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { JwtService } from '@nestjs/jwt';
import { MessageType } from '../constants/enums/message-type.enum';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer() server: Server;
  constructor(private chat: ChatService, private jwt: JwtService) {}

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) return client.disconnect();
    try {
      const payload: any = this.jwt.verify(String(token), { secret: process.env.JWT_SECRET || 'changeme' });
      client.data.userId = payload.sub;
      client.data.relationshipId = payload.relationshipId;
      client.join(`rel:${payload.relationshipId}`);
    } catch {
      client.disconnect();
    }
  }

  @SubscribeMessage('message:send')
  async send(@ConnectedSocket() client: Socket, @MessageBody() data: { content: string; type: MessageType; replyToId?: string }) {
    if (!client.data.relationshipId || !client.data.userId) return;
    const msg = await this.chat.send(client.data.relationshipId, client.data.userId, data.content, data.type, data.replyToId);
    this.server.to(`rel:${client.data.relationshipId}`).emit('message:new', msg);
  }

  @SubscribeMessage('message:react')
  async react(@ConnectedSocket() client: Socket, @MessageBody() data: { messageId: string; value: string }) {
    if (!client.data.relationshipId || !client.data.userId) return;
    const r = await this.chat.react(data.messageId, client.data.userId, data.value);
    this.server.to(`rel:${client.data.relationshipId}`).emit('message:reaction', r);
  }

  @SubscribeMessage('call:offer')
  async callOffer(@ConnectedSocket() client: Socket, @MessageBody() data: { sdp: any }) {
    if (!client.data.relationshipId || !client.data.userId) return;
    client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:offer', { from: client.data.userId, sdp: data.sdp });
  }

  @SubscribeMessage('call:answer')
  async callAnswer(@ConnectedSocket() client: Socket, @MessageBody() data: { sdp: any }) {
    if (!client.data.relationshipId || !client.data.userId) return;
    client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:answer', { from: client.data.userId, sdp: data.sdp });
  }

  @SubscribeMessage('call:ice')
  async callIce(@ConnectedSocket() client: Socket, @MessageBody() data: { candidate: any }) {
    if (!client.data.relationshipId || !client.data.userId) return;
    client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:ice', { from: client.data.userId, candidate: data.candidate });
  }

  @SubscribeMessage('call:end')
  async callEnd(@ConnectedSocket() client: Socket) {
    if (!client.data.relationshipId || !client.data.userId) return;
    client.broadcast.to(`rel:${client.data.relationshipId}`).emit('call:end', { from: client.data.userId });
  }
}