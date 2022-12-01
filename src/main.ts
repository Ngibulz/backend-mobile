import { UnauthorizedExceptionFilter, ForbiddenExceptionFilter } from './app.unauthorize_exception_filter';
import { UnauthorizedException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  })
  app.useGlobalFilters(new UnauthorizedExceptionFilter);
  app.useGlobalFilters(new ForbiddenExceptionFilter);
  await app.listen(80);
}
bootstrap();
