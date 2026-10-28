export class AuthorResponseDto {
  id!: number;
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
  id!: number;
  title!: string;
  content!: string;
  authorId!: number;
  author!: AuthorResponseDto;
  createdAt!: Date;
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
