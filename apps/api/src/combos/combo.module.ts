import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboEntity } from './entities/combo.entity';
import { ComboItem } from './entities/combo-item.entity';
import { Variant } from '../products/entities/variant.entity';
import { ComboService } from './combo.service';
import { ComboController } from './combo.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ComboEntity, ComboItem, Variant]),
  ],
  controllers: [ComboController],
  providers: [ComboService],
  exports: [ComboService],
})
export class ComboModule {}
