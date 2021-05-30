import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { QueryLine, ValidVariables } from '../database/neofj/neofj.service'
import { CategoryService } from '../category/category.service';
import { Sentence } from './sentence.entity';
import { v4 as uuid } from 'uuid'
import { Category } from '../category/category.entity';
import { AddSentencePayload } from './sentence.resolver';
import { INode } from '../database/neofj/neofj.resolver';
import { SearchSentencePayload } from './sentence.resolver'

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
            // {
            //     query: `CREATE (s:Sentence {
            //         id: $sentence.id,
            //         fr: $sentence.fr,
            //         es: $sentence.es
            //     })`,
            //     variables: [
            //         INode.createNodeWithId({
            //             instancor: Sentence,
            //             alias: 'sentence',
            //             props: sentence
            //         })
            //     ]
            // },
            // {
            //     query: 'MATCH(c: Category { id: $category.id })',
            //     variables: [
            //         INode.createNodeOptional({
            //             instancor: Category,
            //             alias: 'category',
            //             props: { id: relations.category.id }
            //         })
            //     ]
            // },
            {
                query: 'MERGE(s)-[: BELONGS_TO]->(c)'
            }
        ],
        )
        /** public toObject(): Object */
        // https://neo4j.com/docs/api/javascript-driver/4.2/class/src/record.js~Record.html
        return records.map(record => record.toObject())[0].s.properties
    }


    async searchSentences(filters?: SearchSentencePayload) {
        const queryLines: QueryLine[] = [
            { query: 'MATCH (s:Sentence), (c:Category)' },
        ]

        if (filters) {
            const filtersLines: QueryLine[] = []
            if (filters.id) { filtersLines.push({ query: 'AND s.id = $sentence.id' }) }
            if (filters.fr) { filtersLines.push({ query: 'AND s.fr = $sentence.fr' }) }
            if (filters.es) { filtersLines.push({ query: 'AND s.es = $sentence.es' }) }

            if (filters.category?.slug) { filtersLines.push({ query: 'AND c.slug = $category.slug' }) }
            if (filters.category?.es) { filtersLines.push({ query: 'AND c.es = $category.es' }) }
            if (filters.category?.fr) { filtersLines.push({ query: 'AND c.fr = $category.fr' }) }
            if (filters.category?.id) { filtersLines.push({ query: 'AND c.id = $category.id' }) }
            if (filters.category) { filtersLines.push({ query: 'AND (s)-[:BELONGS_TO]->(c)' }) }


            if (filtersLines.length) {
                filtersLines[0].query = filtersLines[0].query.replace('AND ', 'WHERE ')
                queryLines.push(...filtersLines)
            }
        }
        const variables = [
            INode.createNodeOptional({
                instancor: Sentence,
                alias: 'sentence',
                props: {
                    id: filters?.id,
                    fr: filters?.fr,
                    es: filters?.es,
                }
            }),
            INode.createNodeOptional({
                instancor: Category,
                alias: 'category',
                props: {
                    id: filters?.category?.id,
                    slug: filters?.category?.slug,
                    fr: filters?.category?.fr,
                    es: filters?.category?.es,
                }
            })
        ].filter(v => !!v) as ValidVariables[]

        queryLines.push({
            query: 'RETURN s',
            variables
        })

        const { records } = await this.neofjService.run(queryLines)
        return records.map(record => record.toObject().s.properties)
    }

    async getCategoryOfTheSentence(sentenceId: string): Promise<Category> {
        const { records } = await this.neofjService.run([
            {
                query: 'MATCH (s:Sentence {id: $sentence.id})-[:BELONGS_TO]->(c:Category) RETURN DISTINCT c LIMIT 1', variables: [
                    INode.createNodeOptional({
                        instancor: Sentence,
                        alias: 'sentence',
                        props: { id: sentenceId }
                    })
                ]
            }
        ])
        return records.map(r => r.toObject().c.properties)[0]
    }

}
