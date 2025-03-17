import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  async create(
    @Body('name') name: string,
    @Query('parentId') parentId?: string,
  ): Promise<Category> {
    try {
      return await this.categoryService.create(name, parentId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    try {
      const category = await this.categoryService.getById(id);
      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/parent/:parentId')
  async findByParent(@Param('parentId') parentId: string): Promise<Category[]> {
    try {
      return await this.categoryService.getByParentId(parentId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, { name });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
