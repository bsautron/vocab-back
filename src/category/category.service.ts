import { Injectable } from '@nestjs/common';
import { INode } from '../database/neofj/neofj.resolver';
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


    async addCategory(categoryPayload: AddCategoryPayload): Promise<Category> {
        const { records } = await this.neofjService.run(`CREATE (a:Category {
            id: $category.id,
            slug: $category.slug,
            image: $category.image,
            fr: $category.fr,
            es: $category.es
        }) RETURN a`, [
            INode.createNodeWithId({
                c: Category,
                alias: 'category',
                props: categoryPayload
            })
        ])
        return records.map(r => r.toObject().a.properties)[0]
    }

    async getCategories(filters?): Promise<Category[]> {
        const { records } = await this.neofjService.run('MATCH (c:Category) RETURN c')
        return records.map(record => record.toObject().c.properties)
    }
}



