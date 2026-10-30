import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// NestJS 기본 예외 응답 형태 (HttpException / ValidationPipe)
export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({
    description: '에러 메시지. 유효성 검사 실패 시에는 메시지 배열',
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: '에러 메시지',
  })
  message!: string | string[];

  @ApiPropertyOptional({ example: 'Bad Request' })
  error?: string;
}
