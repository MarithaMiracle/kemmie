
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateMessageRequestDto {
  @Expose()
  @ApiProperty({ example: 'It’s okay to rest today.', required: true })
  @IsString()
  content: string;
}