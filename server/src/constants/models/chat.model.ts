
import { MessageType } from '../enums/message-type.enum';

export interface MessageModel {
  id: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
}

export interface MessageReactionModel {
  id: string;
  messageId: string;
  userId: string;
  value: string;
  createdAt: Date;
}