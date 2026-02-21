import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('Starting server');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 API is running on http://localhost:${PORT}/api/v1`);
}
bootstrap();
