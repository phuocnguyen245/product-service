// CategoryRepository.ts
import { Category } from '@prisma/client';
import { prisma } from 'src/config/prisma';

export class CategoryRepository {
  async findUnique(id: string): Promise<Category | null> {
    return await prisma.category.findUnique({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return await prisma.category.findMany({ orderBy: { lft: 'asc' } });
  }

  async create(data: Category): Promise<Category> {
    return await prisma.category.create({ data });
  }

  async update(
    id: string,
    data: Partial<{ name: string; lft: number; rgt: number; level: number }>,
  ): Promise<Category> {
    return await prisma.category.update({ where: { id }, data });
  }

  async deleteMany(where: object): Promise<any> {
    return await prisma.category.deleteMany({ where });
  }

  async aggregateMaxRgt(): Promise<number> {
    const aggregate = await prisma.category.aggregate({
      _max: { rgt: true },
    });
    return aggregate._max.rgt || 0;
  }

  async findMany(where: object): Promise<Category[]> {
    return await prisma.category.findMany({
      where,
      orderBy: { lft: 'asc' },
    });
  }
}
