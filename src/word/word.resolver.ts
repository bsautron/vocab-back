import { Inject } from '@nestjs/common';
import { Field, InputType, Resolver } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { AddTagPayload } from '../tag/tag.resolver';
import { Word } from './word.entity';
import { WordService } from './word.service';

// @InputType()
// export class WordFilters {
//     @Field(() => [String], { nullable: true })
//     tags?: string[]
// }

// @InputType()
// export class AddWordPayload implements ILocales {

//     @Field(() => [AddTagPayload])
//     tags: AddTagPayload[]

//     @Field({ nullable: true })
//     fr?: string;

//     @Field({ nullable: true })
//     es?: string;
// }



// @Resolver(() => Word)
export class WordResolver {
    constructor(
        @Inject(WordService) protected wordService: WordService,
    ) { }


}
