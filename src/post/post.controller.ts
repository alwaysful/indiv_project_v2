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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto';
import { AuthUser, CurrentUser } from '../login/current-user.decorator';
import { JwtAuthGuard } from '../login/jwt.guard';
import { CreatePostDto } from './dto/createpost.dto';
import { UpdatePostDto } from './dto/updatepost.dto';
import { PostService } from './post.service';
import { DeletePostResponseDto } from './dto/delete-post-response.dto';
import { PostResponseDto } from './dto/post-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  //글생성
  @ApiOperation({ summary: '게시글 작성' })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: '작성 성공', type: PostResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증 실패 (토큰 없음/만료)',
    type: ErrorResponseDto,
  })
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
  @ApiOkResponse({
    description: '최신순 목록',
    type: PostResponseDto,
    isArray: true,
  })
  @Get()
  findAll(): Promise<PostResponseDto[]> {
    return this.postService.findAll();
  }
  //글단일조회
  @ApiOperation({ summary: '게시글 단건 조회' })
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '조회 성공', type: PostResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음',
    type: ErrorResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PostResponseDto> {
    return this.postService.findOne(id);
  }

  //글수정
  @ApiOperation({ summary: '게시글 수정 (작성자만)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID', example: 1 })
  @ApiOkResponse({ description: '수정 성공', type: PostResponseDto })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증 실패 (토큰 없음/만료)',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: '작성자가 아님',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음',
    type: ErrorResponseDto,
  })
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
  @ApiParam({ name: 'id', type: Number, description: '게시글 ID', example: 1 })
  @ApiOkResponse({
    description: '삭제 성공',
    type: DeletePostResponseDto,
  })
  @ApiBadRequestResponse({
    description: '요청 값 유효성 검사 실패',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: '인증 실패 (토큰 없음/만료)',
    type: ErrorResponseDto,
  })
  @ApiForbiddenResponse({
    description: '작성자가 아님',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: '게시글 없음',
    type: ErrorResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeletePostResponseDto> {
    return this.postService.remove(user.id, id);
  }
}
