import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Optional: global prefix biar rapih
  app.setGlobalPrefix('api');

  await app.listen(3000); // exposed sebagai 4000 di docker-compose
}
bootstrap();
