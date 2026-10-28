import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  create(userId: number, dto: CreatePostDto) {
    return this.postRepository.create(userId, dto);
  }

  findAll() {
    return this.postRepository.findAll();
  }

  async findOne(id: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`게시글(${id})을 찾을 수 없습니다.`);
    }
    return post;
  }

  async update(userId: number, id: number, dto: UpdatePostDto) {
    await this.assertOwner(userId, id);
    return this.postRepository.update(id, dto);
  }

  async remove(userId: number, id: number) {
    await this.assertOwner(userId, id);
    await this.postRepository.delete(id);
    return { id };
  }

  /** 게시글이 존재하고, 요청한 사용자가 작성자인지 확인 */
  private async assertOwner(userId: number, id: number) {
    const post = await this.findOne(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException(
        '본인이 작성한 게시글만 수정/삭제할 수 있습니다.',
      );
    }
  }
}
