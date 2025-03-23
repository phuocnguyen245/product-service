// src/grpc-client/grpc-client.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
console.log(join(__dirname, '../proto/inventory.proto'));

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'INVENTORY_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'inventory',
          protoPath: join(process.cwd(), 'src/proto/inventory.proto'),
          url: 'localhost:50053',
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class GrpcClientModule {}
