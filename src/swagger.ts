import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Swagger UI 경로: GET /docs, JSON 스펙: GET /docs-json
export const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Indiv Project API')
    .setDescription(
      '회원가입/로그인(JWT access + refresh 토큰) 및 게시글 CRUD API 문서',
    )
    .setVersion('1.0')
    // @ApiBearerAuth() 가 붙은 엔드포인트에 Authorize 버튼으로 JWT 입력
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    // 새로고침해도 입력한 토큰 유지
    swaggerOptions: { persistAuthorization: true },
  });
}
