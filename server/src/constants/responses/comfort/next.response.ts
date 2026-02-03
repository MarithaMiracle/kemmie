
import { Expose } from 'class-transformer';

export class NextComfortResponseDto {
  @Expose()
  message: string | null;
  
  @Expose()
  cycleId?: number;
}