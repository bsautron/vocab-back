import { Injectable, Logger } from '@nestjs/common';
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
                query: `CREATE (c:Category {
                    id: $category.id,
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
                        props: { id: filters?.id, slug: filters?.slug, fr: filters?.fr, es: filters?.es }
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

    async previewCategories(search: string): Promise<CategoryPreview[]> {
        this.logger.verbose(`previewCategories: {search: "${search}"}`) /* dump variable */
        if (search.trim().length === 0) {
            return (await this.searchCategories()).map(c => ({ ...c, sentencePreviews: [] }))
        }
        const { records: recordsSenteces } = await this.neofjService.run([
            {
                query: 'CALL db.index.fulltext.queryNodes("fullSearchFrEsIndex", $search.keyWords)', variables: [
                    {
                        alias: 'search',
                        properties: {
                            keyWords: search
                        }
                    }
                ]
            },
            { query: 'YIELD node, score' },
            { query: 'MATCH (node)-[:BELONGS_TO]->(c:Category)' },
            { query: 'RETURN node, c, score' },

        ])


        const nodes = recordsSenteces.map(r => r.toObject())

        const cateMap = nodes.reduce((theMap, node) => {
            const props = node.c.properties
            let relatedCate = theMap.get(props.id)
            if (!relatedCate) {
                relatedCate = { ...node.c.properties, sentencePreviews: [node.node.properties] }
            } else {
                relatedCate.sentencePreviews.push(node.node.properties)
            }
            theMap.set(props.id, relatedCate)

            return theMap
        }, new Map())

        return Array.from(cateMap.values())
    }
}



