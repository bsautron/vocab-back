import { Args, Field, InputType, Mutation, ObjectType, Parent, Query, registerEnumType, ResolveField, Resolver } from '@nestjs/graphql';
import { ILocales, LocalesSelector } from '../locales/locales.interface.entity';
import { LinkedSentences, Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';
import { Category } from '../category/category.entity';
import { SearchCategoriesPayload } from '../category/category.resolver';
import { IsEnum } from 'class-validator';

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

@InputType()
export class FiltersSentencesLangsPayload extends LocalesSelector {}

@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected sentenceService: SentenceService,
    ) { }



    @Query(() => [LinkedSentences])
    async linkedSentences(@Args('filters') filters: FiltersSentencesLangsPayload
    ): Promise<LinkedSentences[]> {
        return this.sentenceService.matchSentences(filters.langs)
    }
    // @Query(() => [Sentence])
    // async sentences(@Args({ name: 'filters', type: () => FiltersSentencesPayload, nullable: true }) filters?: FiltersSentencesPayload): Promise<Sentence[]> {
    //     return this.sentenceService.filterSentences(filters)
    // }

    @ResolveField(() => Category)
    async category(@Parent() sentence: Sentence): Promise<Category> {
        return this.sentenceService.getCategoryOfTheSentence(sentence.id)
    }

    @Mutation(() => Sentence)
    async addNewSentence(@Args('sentence') sentence: AddSentencePayload): Promise<Sentence> {
        return this.sentenceService.addNewSentence(sentence)
    }


    
}