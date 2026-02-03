
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateLetterRequestDto {
  @Expose()
  @ApiProperty({ example: 'I love you more every day', required: true })
  @IsString()
  content: string;

  @Expose()
  @ApiProperty({ example: '2026-02-14T07:00:00.000Z', required: true })
  @IsDateString()
  unlockDate: string;
}