
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

export class LoginRequestDto {
  @Expose()
  @ApiProperty({ example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({ example: 'StrongP@ssw0rd', required: true })
  @IsString()
  password: string;
}