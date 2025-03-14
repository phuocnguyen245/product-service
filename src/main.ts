import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { onPrismaConnect } from './config/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await onPrismaConnect();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
