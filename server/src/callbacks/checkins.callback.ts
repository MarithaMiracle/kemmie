
import { Mood } from '../constants/enums/mood.enum';

export function onCheckInRecorded(_relationshipId: string, _userId: string, _mood: Mood) {
  return true;
}