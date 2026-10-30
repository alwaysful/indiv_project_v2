import { ApiProperty } from '@nestjs/swagger';

export class DeletePostResponseDto {
  @ApiProperty({ description: '삭제된 게시글 ID', example: 1 })
  id!: number;
}
