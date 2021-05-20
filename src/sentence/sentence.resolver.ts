import { Args, Field, InputType, Query, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { AddCategoryPayload } from '../category/category.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';

@InputType()
export class AddSentencePayload extends ILocales {

    @Field(() => AddCategoryPayload)
    category?: AddCategoryPayload
}


@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected neofjService: NeofjService,
        protected sentenceService: SentenceService,
    ) { }

    @Query(() => [Sentence])
    async getSentencesByCategory(@Args({ name: 'category', type: () => String, nullable: true }) category?: string): Promise<Sentence[]> {
        // Faire des match different selon les ARGS
        // Toujour retunr un seul type de node (ici r)
        // Meme si je complexify lq query
        // les fieldresolver iront rematcher les sous node
        const { records } = await this.neofjService.run('match (s:Sentence) return s')
        return records.map(({ _fields }) => {
            console.log('_fields:', _fields) /* dump variable */
            return {
                fr: _fields[0].properties.fr
            }
        })
    }

    async category(sentence) {
        // MATCH (s:Sentence {fr: "Ou est la sortie s'il vous plait?"})-[:BELONGS_TO]->(c:Category) return DISTINCT c

    }

}
