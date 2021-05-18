import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReversoContext {
    @Field()
    translation: string;

    @Field({ nullable: true })
    partOfSpeech?: string

    @Field(() => [ReversoExample], { nullable: true })
    examples?: ReversoExample[]

}

@ObjectType()
export class ReversoExample {
    @Field()
    fr: string

    @Field()
    es: string
}