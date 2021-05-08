import { Inject } from '@nestjs/common';
import { Args, Field, InputType, Query, Resolver } from '@nestjs/graphql';
import { Word } from './word.entity';
import { WordService } from './word.service';

@InputType()
export class WordFilters {
    @Field(type => [String], { nullable: true })
    tags?: string
}

@Resolver(of => Word)
export class WordResolver {
    constructor(
        @Inject(WordService) protected wordService: WordService,
    ) { }

    @Query(returns => Word)
    async word(@Args({ name: 'filters', type: () => WordFilters, nullable: true }) filters?: WordFilters[]): Promise<Word> {
        return this.wordService.getOneRandomWordByFilters(filters);
    }
}
