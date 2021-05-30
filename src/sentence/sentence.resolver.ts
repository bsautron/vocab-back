import { Args, Field, InputType, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { ILocales } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';
import { Category } from '../category/category.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { SearchCategoryPayload } from '../category/category.resolver';
import { CategoryService } from '../category/category.service';

@InputType()
export class SentenceRelationsCategoryPayload {
    @Field()
    id: string
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
export class SearchSentencePayload implements ILocales {
    @Field({ nullable: true })
    id?: string;

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;

    @Field(() => SearchCategoryPayload, { nullable: true })
    category?: SearchCategoryPayload

}



@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected sentenceService: SentenceService,
        protected CategoryService: CategoryService,
    ) { }

    // TODO: Toujours en filters
    @Query(() => [Sentence])
    async sentences(@Args({ name: 'filters', type: () => SearchSentencePayload, nullable: true }) filters?: SearchSentencePayload): Promise<Sentence[]> {
        // Faire des match differents selon les ARGS
        // Toujour return un seul type de node (ici r)
        // Meme si je complexify lq query
        // les fieldresolver iront rematcher les sous node

        return this.sentenceService.searchSentences(filters)
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
