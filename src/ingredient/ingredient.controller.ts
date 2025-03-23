import { Controller } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Ingredient } from '@prisma/client';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @GrpcMethod('ProductService', 'CreateIngredient')
  async createInventory(data: Ingredient) {
    try {
      const products = await this.ingredientService.createIngredient(data);
      console.log(JSON.stringify(products));

      return products;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
