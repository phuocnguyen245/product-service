import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { Category } from '@prisma/client';
import { prisma } from 'src/config/prisma';

@Injectable()
export class CategoryService {
  private repository: CategoryRepository;

  async create(name: string, parentId?: string): Promise<Category> {
    return await prisma.$transaction(async (tx) => {
      if (parentId) {
        const parent = await tx.category.findUnique({
          where: { id: parentId },
        });
        if (!parent) {
          throw new Error('Parent not found');
        }

        await tx.category.updateMany({
          where: { rgt: { gte: parent.rgt } },
          data: { rgt: { increment: 2 } },
        });
        await tx.category.updateMany({
          where: { lft: { gt: parent.rgt } },
          data: { lft: { increment: 2 } },
        });

        return await tx.category.create({
          data: {
            name,
            slug: name.toLowerCase().replace(/ /g, '-'),
            lft: parent.rgt,
            rgt: parent.rgt + 1,
            level: parent.level + 1,
          },
        });
      } else {
        const maxRgt = await tx.category
          .aggregate({ _max: { rgt: true } })
          .then((res) => res._max.rgt || 0);
        const newLft = maxRgt + 1;
        return await tx.category.create({
          data: {
            name,
            lft: newLft,
            rgt: newLft + 1,
            level: 0,
          },
        });
      }
    });
  }

  async getAll(): Promise<Category[]> {
    return await this.repository.findAll();
  }

  async getById(id: string): Promise<Category | null> {
    return await this.repository.findUnique(id);
  }

  async getByParentId(parentId: string): Promise<Category[]> {
    const parent = await this.repository.findUnique(parentId);
    if (!parent) {
      throw new Error('Parent not found');
    }

    return await this.repository.findMany({
      lft: { gt: parent.lft },
      rgt: { lt: parent.rgt },
      level: parent.level + 1,
    });
  }

  async update(id: string, data: { name?: string }): Promise<Category> {
    return await this.repository.update(id, data);
  }

  async delete(id: string): Promise<{ message: string }> {
    return await prisma.$transaction(async (tx) => {
      const node = await tx.category.findUnique({ where: { id } });
      if (!node) {
        throw new Error('Category not found');
      }
      const width = node.rgt - node.lft + 1;
      await tx.category.deleteMany({
        where: {
          lft: { gte: node.lft },
          rgt: { lte: node.rgt },
        },
      });
      await tx.category.updateMany({
        where: { lft: { gt: node.rgt } },
        data: { lft: { decrement: width } },
      });
      await tx.category.updateMany({
        where: { rgt: { gt: node.rgt } },
        data: { rgt: { decrement: width } },
      });

      return { message: 'Deleted successfully' };
    });
  }
}
