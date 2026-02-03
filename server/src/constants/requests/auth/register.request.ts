
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterRequestDto {
  @Expose()
  @ApiProperty({ example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @Expose()
  @ApiProperty({ example: 'StrongP@ssw0rd', required: true })
  @IsString()
  password: string;

  @Expose()
  @ApiProperty({ example: 'Ada Lovelace', required: true })
  @IsString()
  name: string;

  @Expose()
  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsOptional()
  @IsString()
  birthday?: string;

  @Expose()
  @ApiPropertyOptional({ example: 'demo-rel' })
  @IsOptional()
  @IsString()
  inviteCode?: string;
}