import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MemoriesController } from '../controllers/memories.controller';
import { MemoriesService } from '../services/memories.service';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [MemoriesController],
  providers: [MemoriesService],
  exports: [MemoriesService]
})
export class MemoriesModule {}