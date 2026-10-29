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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../login/current-user.decorator';
import { JwtAuthGuard } from '../login/jwt.guard';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostService } from './post.service';
import { DeletePostResponseDto } from './dto/delete-post-response.dto';
import { PostResponseDto } from './dto/post-response.dto';
interface AuthUser {
  id: number;
  email: string;
}
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //글생성
  @ApiOperation({ summary: '게시글 작성' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.create(user.id, dto);
  }

  //글조회
  @ApiOperation({ summary: '게시글 목록 조회' })
  @Get()
  findAll(): Promise<PostResponseDto[]> {
    return this.postService.findAll();
  }
  //글단일조회
  @ApiOperation({ summary: '게시글 단건 조회' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return this.postService.findOne(id);
  }

  //글수정
  @ApiOperation({ summary: '게시글 수정 (작성자만)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.update(user.id, id, dto);
  }

  //글삭제
  @ApiOperation({ summary: '게시글 삭제 (작성자만)' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletePostResponseDto> {
    return this.postService.remove(user.id, id);
  }
}
