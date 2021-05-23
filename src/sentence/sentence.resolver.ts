import { Args, Field, InputType, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { AddCategoryPayload } from '../category/category.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';
import { Category } from '../category/category.entity';

@InputType()
export class AddSentencePayload implements ILocales {

    @Field(() => AddCategoryPayload)
    category?: AddCategoryPayload

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}


@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected neofjService: NeofjService,
        protected sentenceService: SentenceService,
    ) { }

    @Query(() => [Sentence])
    async getSentencesByCategory(@Args({ name: 'category', type: () => String, nullable: true }) category?: string): Promise<Sentence[]> {
        // Faire des match differents selon les ARGS
        // Toujour return un seul type de node (ici r)
        // Meme si je complexify lq query
        // les fieldresolver iront rematcher les sous node
        const { records } = await this.neofjService.run('match (s:Sentence) return s')
        return records.map(({ _fields: [record] }) => {
            return record.properties
        })
    }

    @ResolveField()
    async category(@Parent() sentence: Sentence): Promise<Category> {
        const { records } = await this.neofjService.run('MATCH (s:Sentence {id: $id})-[:BELONGS_TO]->(c:Category) return DISTINCT c', { id: sentence.id })
        return records[0]._fields[0].properties

    }
}
