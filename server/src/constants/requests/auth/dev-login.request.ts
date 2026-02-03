import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class DevLoginRequestDto {
  @ApiProperty({ example: 'marithamiracle@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}