import { Field, ObjectType } from '@nestjs/graphql';
import { ALocales } from '../locales/locales.interface.entity';

@ObjectType()
export class ReversoContext {
    @Field()
    translation: string;

    @Field({ nullable: true })
    partOfSpeech?: string

    @Field(() => [ReversoExample], { nullable: true })
    examples?: ReversoExample[]

}

@ObjectType({ implements: [ALocales] })
export class ReversoExample { }