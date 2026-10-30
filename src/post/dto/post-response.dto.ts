import { ApiProperty } from '@nestjs/swagger';

export class AuthorResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ type: String, nullable: true, example: 'hong' })
  username!: string | null;
}

interface PostWithAuthor {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  author: { id: number; username: string | null };
}

export class PostResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: '첫 번째 글' })
  title!: string;

  @ApiProperty({ example: '안녕하세요, 반갑습니다.' })
  content!: string;

  @ApiProperty({ example: 1 })
  authorId!: number;

  @ApiProperty({ type: AuthorResponseDto })
  author!: AuthorResponseDto;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  updatedAt!: Date;

  static from(post: PostWithAuthor): PostResponseDto {
    const dto = new PostResponseDto();
    dto.id = post.id;
    dto.title = post.title;
    dto.content = post.content;
    dto.authorId = post.authorId;
    dto.author = {
      id: post.author.id,
      username: post.author.username,
    };
    dto.createdAt = post.createdAt;
    dto.updatedAt = post.updatedAt;
    return dto;
  }
}
