import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({
    description: 'API 호출용 액세스 토큰 (짧은 만료). Authorization: Bearer',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.access.signature',
  })
  accessToken!: string;

  @ApiProperty({
    description:
      '액세스 토큰 재발급용 리프레시 토큰 (긴 만료). 재발급 시마다 새 토큰으로 교체됨',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.refresh.signature',
  })
  refreshToken!: string;
}
