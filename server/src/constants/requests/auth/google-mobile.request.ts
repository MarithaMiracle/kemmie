import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleMobileLoginRequestDto {
  @ApiProperty({ example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZm...' })
  @IsNotEmpty()
  @IsString()
  idToken: string;
}