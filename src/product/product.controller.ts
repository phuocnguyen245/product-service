import { IProductWithVariant } from './product.d';
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
import { BaseParams } from './product';
import { ProductService } from './product.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @GrpcMethod('ProductService', 'GetProducts')
  async getProducts(data: BaseParams) {
    try {
      const products = await this.productService.getProducts(data);
      console.log(JSON.stringify(products));

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
  async deleteProduct(
    @Param('slug') slug: string,
    @Query('userId') userId: string,
  ) {
    try {
      const deletedProduct = await this.productService.deleteProduct({
        slug,
        userId,
      });
      return deletedProduct;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
