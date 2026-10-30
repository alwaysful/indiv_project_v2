import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: '제목 (최대 200자)',
    example: '수정한 제목',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({ description: '본문', example: '수정한 본문' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  content?: string;
}
