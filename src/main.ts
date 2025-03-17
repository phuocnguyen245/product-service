import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './config/prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await new PrismaService().onModuleInit();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
