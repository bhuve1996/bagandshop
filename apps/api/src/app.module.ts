import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageModule } from './pages/page.module';
import { SectionsModule } from './sections/sections.module';
import { ContentModule } from './content/content.module';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { ComboModule } from './combos/combo.module';
import { VendorModule } from './vendors/vendor.module';
import { OrderModule } from './orders/order.module';
import { UsersModule } from './users/users.module';
import { DiscountModule } from './discounts/discount.module';
import { EmailModule } from './email/email.module';
import { ReviewModule } from './reviews/review.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { SocialModule } from './social/social.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'bagandshop',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    PageModule,
    SectionsModule,
    ContentModule,
    CategoryModule,
    ProductModule,
    ComboModule,
    VendorModule,
    OrderModule,
    UsersModule,
    DiscountModule,
    EmailModule,
    ReviewModule,
    ChatbotModule,
    SocialModule,
  ],
})
export class AppModule {}
