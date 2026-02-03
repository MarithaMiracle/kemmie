
import { Expose } from 'class-transformer';

export class CountdownResponseDto {
  @Expose()
  daysUntil: number | null;

  @Expose()
  message: string;
  
  @Expose()
  targetDate: Date | null;
}