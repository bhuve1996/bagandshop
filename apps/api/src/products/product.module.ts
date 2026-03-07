import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductMedia } from './entities/product-media.entity';
import { ProductFaq } from './entities/product-faq.entity';
import { ProductOption } from './entities/product-option.entity';
import { Variant } from './entities/variant.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductMedia,
      ProductFaq,
      ProductOption,
      Variant,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
