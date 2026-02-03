
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ComfortController } from '../controllers/comfort.controller';
import { ComfortService } from '../services/comfort.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [ComfortController],
  providers: [ComfortService]
})
export class ComfortModule {}