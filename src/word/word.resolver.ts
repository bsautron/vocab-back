import { Inject } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AddLocalesPayload, Locales } from '../locales/locales.interface.entity';
import { ReversoContext } from '../reverso-api/reverso-api.entity';
import { AddTagPayload } from '../tag/tag.resolver';
import { Word } from './word.entity';
import { WordService } from './word.service';

@InputType()
export class WordFilters {
    @Field(() => [String], { nullable: true })
    tags?: string[]
}

@InputType()
export class AddWordPayload {

    @Field(() => AddLocalesPayload)
    locales: AddLocalesPayload

    @Field(() => [AddTagPayload])
    tags: AddTagPayload[]
}



@Resolver(() => Word)
export class WordResolver {
    constructor(
        @Inject(WordService) protected wordService: WordService,
    ) { }

    @Query(() => [Word])
    async words(@Args({ name: 'filters', type: () => WordFilters, nullable: true }) filters?: WordFilters): Promise<Word[]> {
        return this.wordService.getRandomWordsByFilters(filters);
    }
    @Query(() => Word)
    async word(@Args({ name: 'filters', type: () => WordFilters, nullable: true }) filters?: WordFilters): Promise<Word> {
        return this.wordService.getOneRandomWordByFilters(filters);
    }
    @Query(() => [ReversoContext])
    async getContextTranslation(@Args({ name: 'from', type: () => String }) from: string): Promise<ReversoContext[]> {
        return this.wordService.getTradContext(from)
    }

    @Mutation(() => String)
    async addWords(@Args({ name: 'words', type: () => [AddWordPayload] }) wordsPayload: AddWordPayload[]): Promise<string> {
        await this.wordService.addNewWords(wordsPayload)
        return 'ok'
    }
}
