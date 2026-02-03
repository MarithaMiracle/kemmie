
export interface LetterModel {
  id: string;
  content: string;
  unlockDate: Date;
  readAt?: Date | null;
}

export interface TodayLetterModel {
  letter: LetterModel | null;
  unlocked: boolean;
  unlockInSeconds: number;
}