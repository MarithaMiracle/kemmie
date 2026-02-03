
import { Mood } from '../enums/mood.enum';

export interface CheckInEntity {
  id: string;
  relationshipId: string;
  userId: string;
  date: Date;
  mood: Mood;
}

export interface CheckInResponseEntity {
  id: string;
  relationshipId: string;
  authorId: string;
  mood: Mood;
  content: string;
  createdAt: Date;
}