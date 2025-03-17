// CategoryRepository.ts
import { Category } from '@prisma/client';
import { PrismaService } from 'src/config/prisma';

export class CategoryRepository {
  constructor(private prisma: PrismaService) {}
  async findUnique(id: string): Promise<Category | null> {
    return await this.prisma.category.findUnique({ where: { id } });
  }

  async findAll(): Promise<Category[]> {
    return await this.prisma.category.findMany({ orderBy: { lft: 'asc' } });
  }

  async create(data: Category): Promise<Category> {
    return await this.prisma.category.create({ data });
  }

  async update(
    id: string,
    data: Partial<{ name: string; lft: number; rgt: number; level: number }>,
  ): Promise<Category> {
    return await this.prisma.category.update({ where: { id }, data });
  }

  async deleteMany(where: object): Promise<any> {
    return await this.prisma.category.deleteMany({ where });
  }

  async aggregateMaxRgt(): Promise<number> {
    const aggregate = await this.prisma.category.aggregate({
      _max: { rgt: true },
    });
    return aggregate._max.rgt || 0;
  }

  async findMany(where: object): Promise<Category[]> {
    return await this.prisma.category.findMany({
      where,
      orderBy: { lft: 'asc' },
    });
  }
}
