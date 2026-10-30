import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '제목 (최대 200자)', example: '첫 번째 글' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: '본문', example: '안녕하세요, 반갑습니다.' })
  @IsString()
  @IsNotEmpty()
  content!: string;
}
