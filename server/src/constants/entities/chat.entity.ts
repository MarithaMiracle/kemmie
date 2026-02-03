
import { MessageType } from '../enums/message-type.enum';

export interface MessageEntity {
  id: string;
  relationshipId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
}

export interface MessageReactionEntity {
  id: string;
  messageId: string;
  userId: string;
  value: string;
  createdAt: Date;
}