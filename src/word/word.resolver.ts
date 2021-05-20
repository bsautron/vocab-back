import { Inject } from '@nestjs/common';
import { Args, Field, InputType, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ILocales, Locales } from '../locales/locales.interface.entity';
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
export class AddWordPayload extends ILocales {

    @Field(() => [AddTagPayload])
    tags: AddTagPayload[]
}



@Resolver(() => Word)
export class WordResolver {
    constructor(
        @Inject(WordService) protected wordService: WordService,
    ) { }


}
