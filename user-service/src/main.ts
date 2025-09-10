import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // buang field yang ga ada di DTO
      forbidNonWhitelisted: true, // error kalau ada field asing
      transform: true, // auto transform tipe data
    }),
  );
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
