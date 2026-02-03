
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LettersController } from '../controllers/letters.controller';
import { LettersService } from '../services/letters.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [LettersController],
  providers: [LettersService]
})
export class LettersModule {}