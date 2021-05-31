import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryPreviewResolver, CategoryResolver } from './category.resolver';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TagModule,
  ],
  providers: [
    CategoryService,
    CategoryResolver,
    CategoryPreviewResolver
  ],
  exports: [CategoryService]
})
export class CategoryModule { }
