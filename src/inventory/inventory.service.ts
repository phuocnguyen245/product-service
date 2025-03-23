// src/inventory/inventory.service.ts
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

interface InventoryServiceClient {
  createInventory({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }): Observable<{ success: boolean; message: string }>;
}

@Injectable()
export class InventoryService implements OnModuleInit {
  private inventoryService: InventoryServiceClient;

  constructor(@Inject('INVENTORY_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.inventoryService =
      this.client.getService<InventoryServiceClient>('InventoryService');
  }

  async createInventory(id: string, quantity: number = 0) {
    console.log('Creating inventory for item:', id, quantity);

    const response = await firstValueFrom(
      this.inventoryService.createInventory({
        id,
        quantity,
      }),
    );
    return response;
  }
}
