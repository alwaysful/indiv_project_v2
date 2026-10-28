import { Injectable } from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';

// 작성자 정보는 id/username 만 노출 (이메일, 비밀번호 제외)
const withAuthor = {
  author: { select: { id: true, username: true } },
} satisfies Prisma.PostInclude;

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(authorId: number, dto: CreatePostDto) {
    return this.prisma.post.create({
      data: { title: dto.title, content: dto.content, authorId },
      include: withAuthor,
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: withAuthor,
    });
  }

  findById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: withAuthor,
    });
  }

  update(id: number, dto: UpdatePostDto) {
    // undefined 인 필드는 Prisma 가 변경하지 않는다.
    return this.prisma.post.update({
      where: { id },
      data: { title: dto.title, content: dto.content },
      include: withAuthor,
    });
  }

  delete(id: number) {
    return this.prisma.post.delete({ where: { id } });
  }
}
