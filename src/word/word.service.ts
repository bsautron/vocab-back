import { Injectable } from '@nestjs/common';
import { ReversoApiService } from '../reverso-api/reverso-api.service';
import { Word } from './word.entity';
// import { AddWordPayload, WordFilters } from './word.resolver';
import { ReversoContext } from '../reverso-api/reverso-api.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class WordService {
    constructor(
        protected reversoApiService: ReversoApiService,
        protected tagService: TagService
    ) { }


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
