import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { TagService } from '../tag/tag.service';
import { Category } from './category.entity';
import { AddCategoryPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    constructor(
        protected tagService: TagService,
        protected neofjService: NeofjService

    ) { }

    async getCategories(filters?): Promise<Category[]> {
        const { records } = await this.neofjService.run('MATCH (c:Category) return c')
        return records.map(({ _fields }) => _fields[0].properties)
    }
}
