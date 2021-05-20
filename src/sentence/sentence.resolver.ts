import { Args, Field, InputType, Query, Resolver } from '@nestjs/graphql';
import { AddCategoryPayload } from '../category/category.resolver';
import { AddLocalesPayload } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';

@InputType()
export class AddSentencePayload {

    @Field(() => AddLocalesPayload)
    locales: AddLocalesPayload

    @Field(() => AddCategoryPayload)
    category?: AddCategoryPayload
}


@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected sentenceService: SentenceService,
    ) { }

    @Query(() => [Sentence])
    async getSentencesByCategory(@Args({ name: 'category', type: () => String }) category: string): Promise<Sentence[]> {
        return this.sentenceService.getSentencesByCategory(category)

    }

}
