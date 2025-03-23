import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';

@Module({
  imports: [GrpcClientModule],
  providers: [InventoryService],
  controllers: [],
  exports: [InventoryService],
})
export class InventoryModule {}
