import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';

@Module({
  imports: [ProductModule, CategoryModule],
  controllers: [ProductController, CategoryController],
})
export class AppModule {}
