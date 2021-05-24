import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { CategoryService } from '../category/category.service';
import { Sentence } from './sentence.entity';
import { AddSentencePayload } from './sentence.resolver';
import { v4 as uuid } from 'uuid'
import { Category } from '../category/category.entity';

@Injectable()
export class SentenceService {
    constructor(
        protected categoryService: CategoryService,
        protected neofjService: NeofjService
    ) {
    }

    async addNewSentence({ relations, ...sentence }: AddSentencePayload): Promise<Sentence> {
        const sen = await this.neofjService.create(Sentence, sentence)
        // const cate = await this.neofjService.create(Category, { slug: 'travel/airport', fr: 'AIZE', es: 'siusdf' })
        const cate = await this.neofjService.matchOne(Category, { id: relations.category.id })
        const { records } = await this.neofjService.run(`
            MATCH (s:Sentence {id: $sentence.id})
            MATCH (c:Category {id: $relations.category.id})
            MERGE (s)-[:BELONGS_TO]->(c)
            RETURN s
        `, {
            sentence: { id: sen.id },
            relations: {
                category: {
                    id: cate.id
                }
            }
        })
        return records.map(({ _fields }) => _fields[0].properties)[0]
    }

}
