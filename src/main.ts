import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger (운영 환경에서는 비활성화)
  if (configService.get<string>('NODE_ENV') !== 'production') {
    setupSwagger(app);
  }

  await app.listen(configService.getOrThrow<number>('PORT'));
}

bootstrap().catch((error: unknown) => {
  new Logger('Bootstrap').error(
    '서버 시작 실패',
    error instanceof Error ? error.stack : String(error),
  );
  process.exit(1);
});
