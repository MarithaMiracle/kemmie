
export interface LetterEntity {
  id: string;
  relationshipId: string;
  authorId: string;
  content: string;
  unlockDate: Date;
  readAt?: Date | null;
  createdAt: Date;
}