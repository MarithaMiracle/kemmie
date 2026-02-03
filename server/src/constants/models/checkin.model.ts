
import { Mood } from '../enums/mood.enum';

export interface CheckInModel {
  date: Date;
  mood: Mood;
}

export interface CheckInRecordResultModel {
  response: string | null;
}