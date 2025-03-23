import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import ProductRepository from './product.repository';
import { PrismaService } from '../config/prisma';

@Module({
  providers: [ProductService, ProductRepository, PrismaService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
