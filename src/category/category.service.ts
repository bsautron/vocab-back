import { Injectable, Logger } from '@nestjs/common';
import { Sentence } from 'src/sentence/sentence.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { NeofjService, QueryLine, Variable } from '../database/neofj/neofj.service';
import { TagService } from '../tag/tag.service';
import { Category, CategoryPreview } from './category.entity';
import { AddCategoryPayload, SearchCategoriesPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        protected tagService: TagService,
        protected neofjService: NeofjService

    ) { }


    async addCategory(categoryPayload: AddCategoryPayload): Promise<Category> {
        const { records } = await this.neofjService.run([
            {
                query: `MERGE (c:Category {
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

    async searchCategories(filters?: SearchCategoriesPayload): Promise<Category[]> {
        const queryLines: QueryLine[] = [
            { query: 'MATCH (c:Category)' },
            { query: 'WHERE exists(c.id)' }
        ]
        const variables: Variable[] = []
        if (filters) {
            const filtersLines: QueryLine[] = []
            const search = `(?i).*${filters.search!.trim()}.*`
            if (filters.search) {
                filtersLines.push({ query: 'AND ((c.slug =~ $category.search)' })
                filtersLines.push({ query: 'OR (c.fr =~ $category.search)' })
                filtersLines.push({ query: 'OR (c.es =~ $category.search))' })
                variables.push({ alias: 'category', properties: { search } })
            } else {
                if (filters.id) { filtersLines.push({ query: 'AND c.id = $category.id' }) }
                if (filters.slug) { filtersLines.push({ query: 'AND c.slug = $category.slug' }) }
                if (filters.fr) { filtersLines.push({ query: 'AND c.fr = $category.fr' }) }
                if (filters.es) { filtersLines.push({ query: 'AND c.es = $category.es' }) }
                variables.push(
                    INode.createNodeOptional({
                        instancor: Category,
                        alias: 'category',
                        props: { slug: filters?.slug, fr: filters?.fr, es: filters?.es }
                    })
                )
            }

            if (filtersLines.length) {
                queryLines.push(...filtersLines)
            }
        }


        queryLines.push({
            query: 'RETURN c',
            variables
        })
        const { records } = await this.neofjService.run(queryLines)
        return records.map(record => record.toObject().c.properties)
    }

    async previewCategories(text: string): Promise<CategoryPreview[]> {
        const search = text.trim()
        
        let queryLines: QueryLine[] = []
        this.logger.verbose(`{search: "${search}"}`, `${CategoryService.name}: [previewCategories]`)
        if (search.length === 0) {
            queryLines = [
                { query: 'MATCH (c:Category)' },
                { query: 'CALL {' },
                { query: '    WITH c' },
                { query: '    MATCH (s:Sentence)-[:BELONGS_TO]->(c)' },
                { query: '    RETURN s LIMIT 10' },
                { query: '}' },
                { query: 'RETURN c as relatedNode, s as node' },
            ]
        } else {
            queryLines = [
                {
                    query: 'CALL db.index.fulltext.queryNodes("fullSearchFrEsIndex", toString($search.keyWords))', variables: [
                        {
                            alias: 'search',
                            properties: {
                                keyWords: `*${search}*`
                            }
                        }
                    ]
                },
                { query: 'YIELD node, score' },
                { query: 'OPTIONAL MATCH (node)-[:BELONGS_TO]->(nodeRelated:Category)' },
                { query: 'RETURN node, nodeRelated, score' },
            ]
        }

        const { records: recordsSentences } = await this.neofjService.run(queryLines)

        const nodes = recordsSentences.map(r => r.toObject())

        /**
         * Each row contain the sentence with his category
         * "node" can be a sentence, or a category
         * 
        */
        const cateMap = nodes.reduce((theMap, {node, nodeRelated}) => {
            /** Find what is the "node" */
            /** If the node is a sentence, the "relatedNode" is nothing */
            const category = node.labels.includes(Category.name) ? node : nodeRelated
            const sentence = node.labels.includes(Sentence.name) ? node : undefined
            let relatedCate = theMap.get(category.id)
            if (!relatedCate) {
                relatedCate = { ...category.properties, sentencePreviews: sentence ? [sentence.properties] : [] }
            } else {
                relatedCate.sentencePreviews.push(sentence.properties)
            }
            theMap.set(category.id, relatedCate)

            return theMap
        }, new Map<string, CategoryPreview>())

        return Array.from(cateMap.values())
    }
}



