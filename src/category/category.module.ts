import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './category.repository';
import { PrismaService } from 'src/config/prisma';

@Module({
  providers: [CategoryService, CategoryRepository, PrismaService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
