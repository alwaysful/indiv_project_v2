import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';

// PrismaService 는 전역 PrismaModule, JwtAuthGuard 는 passport 전역 등록(JwtStrategy)을 사용한다.
@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
