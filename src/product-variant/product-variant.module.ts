import { Module } from '@nestjs/common';
import { ProductVariantService } from './product-variant.service';

@Module({
  providers: [ProductVariantService]
})
export class ProductVariantModule {}
