import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { Category } from '@prisma/client';

@Controller()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @GrpcMethod('CategoryService', 'Create')
  async create(data: { name: string; parentId?: string }): Promise<Category> {
    try {
      return await this.categoryService.create(data.name, data.parentId);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('CategoryService', 'FindAll')
  async findAll(): Promise<{ categories: Category[] }> {
    const categories = await this.categoryService.getAll();
    return { categories };
  }

  @GrpcMethod('CategoryService', 'FindOne')
  async findOne(data: { id: string }): Promise<Category> {
    try {
      const category = await this.categoryService.getById(data.id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('CategoryService', 'FindByParent')
  async findByParent(data: {
    id: string;
  }): Promise<{ categories: Category[] }> {
    try {
      const categories = await this.categoryService.getByParentId(data.id);
      return { categories };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('CategoryService', 'Update')
  async update(data: { id: string; name: string }): Promise<Category> {
    try {
      return await this.categoryService.update(data.id, { name: data.name });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @GrpcMethod('CategoryService', 'Delete')
  async delete(data: { id: string }): Promise<{ message: string }> {
    try {
      return await this.categoryService.delete(data.id);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
