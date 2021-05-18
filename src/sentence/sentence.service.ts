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

    async getSentenceByCategory() {
        return this.sentencesRepository.find()
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
