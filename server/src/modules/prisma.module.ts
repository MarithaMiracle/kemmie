import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../repositories/prisma.repository';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}