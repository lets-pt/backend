import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //전역 파이프로 설정 : 모든 요청의 유효성 검사
  app.enableCors({ //클라이언트에 대한 CORS 허용
    origin: 'http://localhost:3000',
  });
  await app.listen(3001);
}
bootstrap();