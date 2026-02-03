
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BirthdayController } from '../controllers/birthday.controller';
import { BirthdayService } from '../services/birthday.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BirthdayController],
  providers: [BirthdayService]
})
export class BirthdayModule {}