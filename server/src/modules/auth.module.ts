
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { GoogleStrategy } from '../auth/google.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'changeme', signOptions: { expiresIn: '7d' } })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy]
})
export class AuthModule {}