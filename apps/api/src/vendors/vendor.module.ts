import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entities/vendor.entity';
import { VendorProductMapping } from './entities/vendor-product-mapping.entity';
import { VendorInventory } from './entities/vendor-inventory.entity';
import { VendorRoutingRule } from './entities/vendor-routing-rule.entity';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([VendorEntity, VendorProductMapping, VendorInventory, VendorRoutingRule]),
  ],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [VendorService],
})
export class VendorModule {}
