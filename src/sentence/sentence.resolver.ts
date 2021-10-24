import { Args, Field, InputType, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';
import { Category } from '../category/category.entity';
import { SearchCategoriesPayload } from '../category/category.resolver';

@InputType()
export class SentenceRelationsCategoryPayload {
    @Field()
    slug: string
}

@InputType()
export class SentenceRelationsPayload {
    @Field(() => SentenceRelationsCategoryPayload)
    category: SentenceRelationsCategoryPayload
}

@InputType()
export class AddSentencePayload implements ILocales {

    @Field(() => SentenceRelationsPayload)
    relations: SentenceRelationsPayload;

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;

}

@InputType()
export class FiltersSentencesPayload implements ILocales {

    @Field({ nullable: true })
    search?: string;

    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;

    @Field(() => SearchCategoriesPayload, { nullable: true })
    category?: SearchCategoriesPayload

}



@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected sentenceService: SentenceService,
    ) { }


    @Query(() => [Sentence])
    async sentences(@Args({ name: 'filters', type: () => FiltersSentencesPayload, nullable: true }) filters?: FiltersSentencesPayload): Promise<Sentence[]> {
        return this.sentenceService.filterSentences(filters)
    }

    @ResolveField(() => Category)
    async category(@Parent() sentence: Sentence): Promise<Category> {
        return this.sentenceService.getCategoryOfTheSentence(sentence.id)
    }

    @Mutation(() => Sentence)
    async addNewSentence(@Args('sentence') sentence: AddSentencePayload): Promise<Sentence> {
        return this.sentenceService.addNewSentence(sentence)
    }
}
