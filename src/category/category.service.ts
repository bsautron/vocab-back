import { Injectable, Logger } from '@nestjs/common';
import { ELocales } from 'src/locales/locales.interface.entity';
import { Sentence } from 'src/sentence/sentence.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { NeofjService, QueryLine, Variable } from '../database/neofj/neofj.service';
import { TagService } from '../tag/tag.service';
import { Category, PreviewCategory, SlugCategory } from './category.entity';
import { AddCategoryPayload, SearchCategoriesPayload } from './category.resolver'

@Injectable()
export class CategoryService {
    private readonly logger = new Logger(CategoryService.name);

    constructor(
        protected tagService: TagService,
        protected neofjService: NeofjService

    ) { }

    async searchSentences(search: string, [ fromLang, toLang ]: ELocales[]): Promise<PreviewCategory[]> {

        const { records } = await this.neofjService.run([
            { query: 'CALL db.index.fulltext.queryNodes("fullSearchSentencesCategories", toString("*banos*"))' },
            { query: 'YIELD node, score' },

            { query: 'MATCH (s1:Sentence)-[:IS_TRANSLATED {lang: $langs.from}]->(sls:Slug:Sentence)<-[:IS_TRANSLATED {lang: $langs.to}]-(s2:Sentence)' },
            { query: 'MATCH (c1:Category)-[:IS_TRANSLATED {lang: $langs.from}]->(slc:Slug:Category)<-[:IS_TRANSLATED {lang: $langs.to}]-(c2:Category)' },
            { query: 'MATCH (sls)-[:BELONGS_TO]->(slc)' },

            { query: 'WHERE s1.normalized = node.normalized' },
            { query: 'OR s2.normalized = node.normalized' },
            { query: 'OR c1.normalized = node.normalized' },
            { query: 'OR c2.normalized = node.normalized' },

            { query: 'RETURN node, s1, s2, c1, c2, sls, slc, score', variables: [
                {
                    alias: 'langs',
                    properties: {
                        from: fromLang,
                        to: toLang,
                    }
                },
                // {
                //     alias: 'search',
                //     properties: {
                //         text: search
                //     }
                // }
            ] },
        ])
        console.log('records:', records) /* dump variable */

        return records
            .map(r => r.toObject())
            .map(r => {
                const ret = {
                    categories: [r.c1.properties, r.c2.properties],
                    sentences: [r.s1.properties, r.s2.properties],
                }
                console.log('ret :', ret ) /* dump variable */
                return ret

            })

    }


    // async addCategory(categoryPayload: AddCategoryPayload): Promise<Category> {
    //     const { records } = await this.neofjService.run([
    //         {
    //             query: `MERGE (c:Category {
    //                 slug: $category.slug,
    //                 image: $category.image,
    //                 fr: $category.fr,
    //                 es: $category.es
    //             })`,
    //             variables: [
    //                 INode.createNodeWithId({
    //                     instancor: Category,
    //                     alias: 'category',
    //                     props: categoryPayload
    //                 })
    //             ]
    //         },
    //         { query: 'RETURN c' }
    //     ])
    //     return records.map(r => r.toObject().c.properties)[0]
    // }

    // async searchCategories(filters?: SearchCategoriesPayload): Promise<Category[]> {
    //     const queryLines: QueryLine[] = [
    //         { query: 'MATCH (c:Category)' },
    //         { query: 'WHERE exists(c.id)' }
    //     ]
    //     const variables: Variable[] = []
    //     if (filters) {
    //         const filtersLines: QueryLine[] = []
    //         const search = `(?i).*${filters.search!.trim()}.*`
    //         if (filters.search) {
    //             filtersLines.push({ query: 'AND ((c.slug =~ $category.search)' })
    //             filtersLines.push({ query: 'OR (c.fr =~ $category.search)' })
    //             filtersLines.push({ query: 'OR (c.es =~ $category.search))' })
    //             variables.push({ alias: 'category', properties: { search } })
    //         } else {
    //             if (filters.id) { filtersLines.push({ query: 'AND c.id = $category.id' }) }
    //             if (filters.slug) { filtersLines.push({ query: 'AND c.slug = $category.slug' }) }
    //             if (filters.fr) { filtersLines.push({ query: 'AND c.fr = $category.fr' }) }
    //             if (filters.es) { filtersLines.push({ query: 'AND c.es = $category.es' }) }
    //             variables.push(
    //                 INode.createNodeOptional({
    //                     instancor: Category,
    //                     alias: 'category',
    //                     props: { slug: filters?.slug, fr: filters?.fr, es: filters?.es }
    //                 })
    //             )
    //         }

    //         if (filtersLines.length) {
    //             queryLines.push(...filtersLines)
    //         }
    //     }


    //     queryLines.push({
    //         query: 'RETURN c',
    //         variables
    //     })
    //     const { records } = await this.neofjService.run(queryLines)
    //     return records.map(record => record.toObject().c.properties)
    // }

    // async previewCategories(text: string): Promise<CategoryPreview[]> {
    //     const search = text.trim()
        
    //     let queryLines: QueryLine[] = []
    //     this.logger.verbose(`{search: "${search}"}`, `${CategoryService.name}: [previewCategories]`)
    //     if (search.length === 0) {
    //         queryLines = [
    //             { query: 'MATCH (c:Category)' },
    //             { query: 'CALL {' },
    //             { query: '    WITH c' },
    //             { query: '    MATCH (s:Sentence)-[:BELONGS_TO]->(c)' },
    //             { query: '    RETURN s LIMIT 10' },
    //             { query: '}' },
    //             { query: 'RETURN c as relatedNode, s as node' },
    //         ]
    //     } else {
    //         queryLines = [
    //             {
    //                 query: 'CALL db.index.fulltext.queryNodes("fullSearchFrEsIndex", toString($search.keyWords))', variables: [
    //                     {
    //                         alias: 'search',
    //                         properties: {
    //                             keyWords: `*${search}*`
    //                         }
    //                     }
    //                 ]
    //             },
    //             { query: 'YIELD node, score' },
    //             { query: 'OPTIONAL MATCH (node)-[:BELONGS_TO]->(nodeRelated:Category)' },
    //             { query: 'RETURN node, nodeRelated, score' },
    //         ]
    //     }

    //     const { records: recordsSentences } = await this.neofjService.run(queryLines)

    //     const nodes = recordsSentences.map(r => r.toObject())

    //     /**
    //      * Each row contain the sentence with his category
    //      * "node" can be a sentence, or a category
    //      * 
    //     */
    //     const cateMap = nodes.reduce((theMap, {node, nodeRelated}) => {
    //         /** Find what is the "node" */
    //         /** If the node is a sentence, the "relatedNode" is nothing */
    //         const category = node.labels.includes(Category.name) ? node : nodeRelated
    //         const sentence = node.labels.includes(Sentence.name) ? node : undefined
    //         let relatedCate = theMap.get(category.id)
    //         if (!relatedCate) {
    //             relatedCate = { ...category.properties, sentencePreviews: sentence ? [sentence.properties] : [] }
    //         } else {
    //             relatedCate.sentencePreviews.push(sentence.properties)
    //         }
    //         theMap.set(category.id, relatedCate)

    //         return theMap
    //     }, new Map<string, CategoryPreview>())

    //     return Array.from(cateMap.values())
    // }
}



