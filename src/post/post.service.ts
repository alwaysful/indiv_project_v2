import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createpost.dto';
import { DeletePostResponseDto } from './dto/delete-post-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async create(userId: number, dto: CreatePostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.create(userId, dto);
    return PostResponseDto.from(post);
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.findAll();
    return posts.map((post) => PostResponseDto.from(post));
  }

  async findOne(id: number): Promise<PostResponseDto> {
    return PostResponseDto.from(await this.getPostOrThrow(id));
  }

  async update(
    userId: number,
    id: number,
    dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    await this.assertOwner(userId, id);
    const post = await this.postRepository.update(id, dto);
    return PostResponseDto.from(post);
  }

  async remove(userId: number, id: number): Promise<DeletePostResponseDto> {
    await this.assertOwner(userId, id);
    await this.postRepository.delete(id);
    return { id };
  }

  // 게시글 조회
  private async getPostOrThrow(id: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
    }
    return post;
  }

  // 게시글이 존재하고, 요청한 사용자가 작성자인지 확인
  private async assertOwner(userId: number, id: number) {
    const post = await this.getPostOrThrow(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 게시글만 수정/삭제할 수 있습니다.',
      );
    }
  }
}
