import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PageSection } from './entities/page-section.entity';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PageSection])],
  controllers: [SectionController],
  providers: [SectionService],
  exports: [SectionService],
})
export class SectionsModule {}
