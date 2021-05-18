import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagService } from '../tag/tag.service';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { AddCategoryPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category) protected categoriesRepository: Repository<Category>,
        protected tagService: TagService

    ) { }

    async addCategory(category: AddCategoryPayload): Promise<Category> {
        await this.categoriesRepository.createQueryBuilder()
            .insert()
            .values([category])
            .onConflict(`("slug") DO NOTHING`)
            .execute();

        const targetCate = await this.categoriesRepository.findOneOrFail({ where: { slug: category.slug } })

        for (const tag of category.tags) {
            const targetTag = await this.tagService.addTag(tag)

            await this.categoriesRepository.createQueryBuilder()
                .relation('tags')
                .of(targetCate.id)
                .add(targetTag)
                .catch(err => {
                    if (err.code !== '23505') {
                        throw new Error(err)
                    }
                })
        }
        return targetCate
    }
}
