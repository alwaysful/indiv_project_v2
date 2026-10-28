import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// PostModule 등 다른 모듈에서 별도 import 없이 PrismaService 를 주입받도록 전역 등록
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
