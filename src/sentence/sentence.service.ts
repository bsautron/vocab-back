import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../category/category.service';
import { UserService } from '../user/user.service';
import { Repository } from 'typeorm';
import { Sentence } from './sentence.entity';
import { AddSentencePayload } from './sentence.resolver';

@Injectable()
export class SentenceService {
    constructor(
        @InjectRepository(Sentence) protected sentencesRepository: Repository<Sentence>,
        protected categoryService: CategoryService,
        protected userService: UserService

    ) { }

    async getSentencesByCategory(categorySlug: string): Promise<Sentence[]> {
        const qb = await this.sentencesRepository.createQueryBuilder('sentence')
            .leftJoinAndSelect('sentence.addedBy', 'user')
            .leftJoinAndSelect('sentence.category', 'category')
            .leftJoinAndSelect('category.tags', 'tags')

        return qb.where('category.slug = :categorySlug', { categorySlug: categorySlug }).getMany()
    }

    async addNewSentences(sentences: AddSentencePayload[], userId: string) {
        const user = await this.userService.getUserById(userId)
        for (const sentence of sentences) {
            const targetCategory = await this.categoryService.addCategory(sentence.category)

            await this.sentencesRepository.insert({
                locales: { es: sentence.locales.es, fr: sentence.locales.fr },
                addedBy: user,
                category: targetCategory
            })

        }
    }
}
