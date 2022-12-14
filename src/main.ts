import { UnauthorizedExceptionFilter, ForbiddenExceptionFilter } from './app.unauthorize_exception_filter';
import { UnauthorizedException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useLogger(config.get<string>('NODE_ENV') === 'prod' && config.get<boolean>('DEBUG', false) === false ? ["warn", "error"] : ["log", "warn", "error", 'debug', 'verbose']);

  app.enableCors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  })
  app.useGlobalFilters(new UnauthorizedExceptionFilter);
  app.useGlobalFilters(new ForbiddenExceptionFilter);
  await app.listen(process.env.PORT || 80)}
bootstrap();
