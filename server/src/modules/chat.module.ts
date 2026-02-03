
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ChatGateway } from '../gateways/chat.gateway';
import { ChatService } from '../services/chat.service';
import { ChatController } from '../controllers/chat.controller';

@Module({
  imports: [JwtModule.register({}), PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService]
})
export class ChatModule {}