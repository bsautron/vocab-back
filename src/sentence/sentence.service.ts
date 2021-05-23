import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { CategoryService } from '../category/category.service';
import { Sentence } from './sentence.entity';
import { AddSentencePayload } from './sentence.resolver';
import { v4 as uuid } from 'uuid'

@Injectable()
export class SentenceService {
    constructor(
        protected categoryService: CategoryService,
        protected neofjService: NeofjService
    ) {
    }

    async addNewSentence({ relations, ...sentence }: AddSentencePayload): Promise<Sentence> {
        const { records } = await this.neofjService.run(`
            CREATE (s:Sentence { id: $sentence.id, fr: $sentence.fr, es: $sentence.es })
            MERGE (c:Category { id: $relations.category.id })
            MERGE (s)-[:BELONGS_TO]->(c)
            RETURN s
        `, {
            sentence: {
                id: uuid(),
                ...sentence
            },
            relations: {
                category: {
                    id: relations.category.id
                }
            }
        })
        return records.map(({ _fields }) => _fields[0].properties)
    }

}
