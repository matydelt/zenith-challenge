import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { CustomLogger } from './common/logger.service';

async function bootstrap() {
  configDotenv();
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });
  console.log(
    `Server is running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
