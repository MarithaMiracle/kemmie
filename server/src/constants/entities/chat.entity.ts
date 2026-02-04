
import { MessageType } from '../enums/message-type.enum';

export interface MessageEntity {
  id: string;
  relationshipId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: Date;
  editedAt?: Date | null;
  deletedAt?: Date | null;
  pinned?: boolean;
  replyToId?: string | null;
}

export interface MessageReactionEntity {
  id: string;
  messageId: string;
  userId: string;
  value: string;
  createdAt: Date;
}