import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryResolver } from './category.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TagModule,
  ],
  providers: [
    CategoryService,
    CategoryResolver
  ],
  exports: [CategoryService]
})
export class CategoryModule { }
