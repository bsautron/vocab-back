import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { CategoryService } from '../category/category.service';
import { Sentence } from './sentence.entity';
// import { AddSentencePayload } from './sentence.resolver';
import { v4 as uuid } from 'uuid'
import { Category } from '../category/category.entity';
import { AddSentencePayload } from './sentence.resolver';
import { INode } from '../database/neofj/neofj.resolver';

@Injectable()
export class SentenceService {
    constructor(
        protected categoryService: CategoryService,
        protected neofjService: NeofjService
    ) {
    }

    async addNewSentence({ relations, ...sentence }: AddSentencePayload): Promise<Sentence> {

        // const sen = await this.neofjService.createOne(Sentence, sentence)
        // const cate = await this.neofjService.createOne(Category, { slug: 'travel/airport', fr: 'AIZE', es: 'siusdf' })
        // const cate = await this.neofjService.matchOne(Category, { id: relations.category.id })

        // console.log('sen:', sen) /* dump variable */
        // console.log('cate:', cate) /* dump variable */
        const { records } = await this.neofjService.run([
            {
                query: `CREATE (s:Sentence {
                    id: $sentence.id,
                    fr: $sentence.fr,
                    es: $sentence.es
                })`,
                variables: [
                    INode.createNodeWithId({
                        instancor: Sentence,
                        alias: 'sentence',
                        props: sentence
                    })
                ]
            },
            {
                query: 'MATCH(c: Category { id: $category.id })',
                variables: [
                    INode.createNodeOptional({
                        instancor: Category,
                        alias: 'category',
                        props: { id: relations.category.id }
                    })
                ]
            },
            {
                query: 'MERGE(s)-[: BELONGS_TO]->(c)'
            }
        ],
        )
        /** public toObject(): Object */
        // https://neo4j.com/docs/api/javascript-driver/4.2/class/src/record.js~Record.html
        return records.map(record => record.toObject())[0].s.properties
    }

}
