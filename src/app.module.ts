import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ProductController } from './product/product.controller';
import { CategoryController } from './category/category.controller';
import { IngredientModule } from './ingredient/ingredient.module';
import { InventoryModule } from './inventory/inventory.module';
import { IngredientController } from './ingredient/ingredient.controller';

@Module({
  imports: [ProductModule, CategoryModule, IngredientModule, InventoryModule],
  controllers: [ProductController, CategoryController, IngredientController],
})
export class AppModule {}
