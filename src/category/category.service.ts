import { Injectable } from '@nestjs/common';
import { query } from 'express';
import { INode } from '../database/neofj/neofj.resolver';
import { NeofjService } from '../database/neofj/neofj.service';
import { TagService } from '../tag/tag.service';
import { Category } from './category.entity';
import { AddCategoryPayload, SearchCategoryPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    constructor(
        protected tagService: TagService,
        protected neofjService: NeofjService

    ) { }


    async addCategory(categoryPayload: AddCategoryPayload): Promise<Category> {
        const { records } = await this.neofjService.run([
            {
                query: `CREATE (c:Category {
                    id: $category.id,
                    slug: $category.slug,
                    image: $category.image,
                    fr: $category.fr,
                    es: $category.es
                })`,
                variables: [
                    INode.createNodeWithId({
                        instancor: Category,
                        alias: 'category',
                        props: categoryPayload
                    })
                ]
            },
            { query: 'RETURN c' }
        ])
        return records.map(r => r.toObject().c.properties)[0]
    }

    async searchCategories(filters?: SearchCategoryPayload): Promise<Category[]> {
        const { records } = await this.neofjService.run([{ query: 'MATCH (c:Category) RETURN c' }])
        return records.map(record => record.toObject().c.properties)
    }
}



