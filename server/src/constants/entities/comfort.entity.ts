
export interface ComfortMessageEntity {
  id: string;
  relationshipId: string;
  authorId: string;
  content: string;
  createdAt: Date;
}

export interface ComfortStateEntity {
  id: string;
  relationshipId: string;
  cycleId: number;
  createdAt: Date;
}

export interface ComfortStateUsedEntity {
  id: string;
  comfortStateId: string;
  messageId: string;
  createdAt: Date;
}