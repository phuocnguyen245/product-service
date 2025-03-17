import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { IProductWithVariant } from './product';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('')
  async getProducts(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Query('search') search: string,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    try {
      const products = await this.productService.getProducts({
        limit,
        page,
        search,
        from,
        to,
      });
      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get(':slug')
  async getProductBySlug(@Param('slug') slug: string) {
    try {
      const product = await this.productService.getProductFromSlug(slug);
      return product;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Post('')
  async createProduct(@Body() product: IProductWithVariant) {
    try {
      const newProduct = await this.productService.createProduct(product);
      return newProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put('')
  async updateProduct(
    @Body() product: IProductWithVariant,
    @Param('id') id: string,
  ) {
    try {
      const updatedProduct = await this.productService.updateProduct({
        ...product,
        id,
      });
      return updatedProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':slug')
  async deleteProduct(@Param('slug') slug: string) {
    try {
      const deletedProduct = await this.productService.deleteProduct(slug);
      return deletedProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
