import { PrismaService } from '../config/prisma';
import { Ingredient, Prisma } from '@prisma/client';
import { BaseParams } from 'src/product/product';
import constants from '../constants';

class IngredientRepository {
  constructor(private prisma: PrismaService) {}
  async createIngredient(ingredientPayload: Ingredient) {
    const newIngredient = await this.prisma.ingredient.create({
      data: ingredientPayload,
    });
    return newIngredient;
  }

  async getIngredients({ userId, page, limit, search, from, to }: BaseParams) {
    try {
      const whereCondition: Prisma.IngredientWhereInput = {
        userId,
        isDeleted: false,
        ...(search ? { name: { contains: search } } : {}),
        AND: [
          { createdAt: { gte: new Date(from || constants.FROM) } },
          { createdAt: { lte: new Date(to || constants.TO) } },
        ],
      };

      const ingredients = await this.prisma.ingredient.findMany({
        where: whereCondition,
        take: limit,
        skip: page * limit,
      });
      return ingredients;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getIngredientById(id: string) {
    const ingredient = await this.prisma.ingredient.findUnique({
      where: { id, isDeleted: false },
    });
    return ingredient;
  }

  async deleteIngredientById(id: string) {
    return await this.prisma.ingredient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
  }

  async updateIngredientById(id: string, ingredientPayload: Ingredient) {
    return await this.prisma.ingredient.update({
      where: { id },
      data: ingredientPayload,
    });
  }
}

export default IngredientRepository;
