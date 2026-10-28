import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import type { AuthUser } from '../login/auth.types';
import { CurrentUser } from '../login/current-user.decorator';
import { JwtAuthGuard } from '../login/jwt.guard';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // 조회(목록/단건)는 누구나, 작성/수정/삭제는 로그인 필요

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePostDto) {
    return this.postService.create(user.id, dto);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(user.id, id);
  }
}
