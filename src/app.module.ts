import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoriesModule } from './categories/categories.module';
import { ProducVariantModule } from './produc-variant/produc-variant.module';
import { ProductVariantService } from './product-variant/product-variant.service';
import { ProductVariantController } from './product-variant/product-variant.controller';
import { ReviewsModule } from './reviews/reviews.module';
import { ProductVariantModule } from './product-variant/product-variant.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [ProductModule, CategoriesModule, ProducVariantModule, ReviewsModule, ProductVariantModule, CategoryModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
})
export class AppModule {}
