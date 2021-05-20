import { Injectable } from '@nestjs/common';
import { TagService } from '../tag/tag.service';
import { Category } from './category.entity';
import { AddCategoryPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    constructor(
        protected tagService: TagService

    ) { }

    async addCategory(category: AddCategoryPayload): Promise<void> {

    }

    async getCategoryBySlug(slug: string): Promise<void> {

    }
}
