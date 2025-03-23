import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { InventoryModule } from '../inventory/inventory.module';
import { PrismaService } from 'src/config/prisma';
import IngredientRepository from './ingredient.repository';

@Module({
  imports: [InventoryModule],
  controllers: [IngredientController],
  providers: [PrismaService, IngredientService, IngredientRepository],
  exports: [IngredientService],
})
export class IngredientModule {}
