import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma';
import IngredientRepository from './ingredient.repository';
import { Ingredient } from '@prisma/client';
import { InventoryService } from 'src/inventory/inventory.service';
import { BaseParams } from 'src/product/product';

@Injectable()
export class IngredientService {
  constructor(
    private prisma: PrismaService,
    private ingredientRepo: IngredientRepository,
    private inventoryService: InventoryService,
  ) {}

  async createIngredient(ingredientPayload: Ingredient) {
    return await this.prisma.$transaction(async (tx) => {
      const newIngredient = await tx.ingredient.create({
        data: ingredientPayload,
        select: {
          id: true,
        },
      });

      const response = await this.inventoryService.createInventory(
        newIngredient.id,
        0,
      );

      if (!response.success) {
        throw new Error('Failed to create inventory');
      }

      return newIngredient;
    });
  }

  async getIngredients({ userId, page, limit, search, from, to }: BaseParams) {
    return this.ingredientRepo.getIngredients({
      userId,
      page,
      limit,
      search,
      from,
      to,
    });
  }

  async getIngredientById(id: string) {
    return this.ingredientRepo.getIngredientById(id);
  }

  async deleteIngredientById(id: string) {
    return this.ingredientRepo.deleteIngredientById(id);
  }

  async updateIngredientById(id: string, ingredientPayload: Ingredient) {
    return this.ingredientRepo.updateIngredientById(id, ingredientPayload);
  }
}
