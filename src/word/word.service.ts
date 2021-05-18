import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReversoApiService } from '../reverso-api/reverso-api.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Tag } from '../tag/tag.entity';
import { Word } from './word.entity';
import { AddWordPayload, WordFilters } from './word.resolver';
import { ReversoContext } from '../reverso-api/reverso-api.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class WordService {
    constructor(
        @InjectRepository(Word) protected wordsRepository: Repository<Word>,
        protected reversoApiService: ReversoApiService,
        protected tagService: TagService
    ) { }

    protected createRandomWordQB(filters?: WordFilters): SelectQueryBuilder<Word> {
        const qb = this.wordsRepository.createQueryBuilder('word')
        qb.innerJoinAndSelect('word.tags', 'tags')
        if (filters?.tags) {
            qb.where('tags.name IN (:...tags)', { tags: filters.tags })
        }
        qb.orderBy('random()')
        return qb
    }
    async getOneRandomWordByFilters(filters?: WordFilters): Promise<Word> {
        return this.createRandomWordQB(filters).getOneOrFail()
    }
    async getRandomWordsByFilters(filters?: WordFilters): Promise<Word[]> {
        return this.createRandomWordQB(filters).getMany()
    }

    async addNewWords(words: AddWordPayload[]) {
        for (const word of words) {
            const { generatedMaps: [wordId] } = await this.wordsRepository.insert({ locales: { es: word.locales.es, fr: word.locales.fr } })
            for (const tag of word.tags) {
                const targetTag = await this.tagService.addTag(tag)

                await this.wordsRepository.createQueryBuilder()
                    .relation('tags')
                    .of(wordId)
                    .add(targetTag)
            }
        }
    }

    async getTradContext(word): Promise<ReversoContext[]> {
        const { data } = await this.reversoApiService.getTranslate(word)

        return data.contextResults.results.map(({ translation, sourceExamples, targetExamples, partOfSpeech }) => {
            const examples = []

            for (let i = 0; i < sourceExamples.length; i++) {
                examples.push({
                    fr: sourceExamples[i],
                    es: targetExamples[i],
                })
            }
            console.log('examples:', examples) /* dump variable */
            return {
                translation,
                examples,
                partOfSpeech,
            }

        })

    }
}
