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
  private categoryService: CategoryService;

  constructor() {
    // Trong trường hợp thực tế, bạn nên sử dụng Dependency Injection của NestJS
    this.categoryService = new CategoryService();
  }

  // Tạo category mới. Nếu có parentId truyền vào thông qua query, sẽ tạo category con
  @Post()
  async create(
    @Body('name') name: string,
    @Query('parentId') parentId?: string,
  ): Promise<Category> {
    try {
      return await this.categoryService.create(name, parentId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Lấy tất cả category (sắp xếp theo lft)
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoryService.getAll();
  }

  // Lấy category theo id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Category> {
    const category = await this.categoryService.getById(id);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  // Lấy các category con trực tiếp của một parent (truyền parentId qua query string)
  @Get('/parent/:parentId')
  async findByParent(@Param('parentId') parentId: string): Promise<Category[]> {
    try {
      return await this.categoryService.getByParentId(parentId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Cập nhật category (ở đây chỉ cập nhật tên)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body('name') name: string,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(id, { name });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Xóa category (và toàn bộ cây con của nó)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    try {
      return await this.categoryService.delete(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
