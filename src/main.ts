import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './ common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Apply Global Filter
  app.useGlobalFilters(new AllExceptionsFilter());
  //Enable CORS (Essential for Next.js Frontend)
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
  // Global Validation (Validates DTOs automatically)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips unseen properties
      transform: true, // Auto-transforms payloads to DTO instances
    }),
  );
  //  Global Prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
