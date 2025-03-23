import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices/enums';
import { PrismaService } from './config/prisma';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'product',
        protoPath: 'src/proto/product.proto',
        url: '0.0.0.0:50052',
      },
    },
  );

  await new PrismaService().onModuleInit();
  await app.listen();
  console.log('🚀 User Service is running on gRPC port 50052');
}
bootstrap();
