import { Field, ObjectType } from '@nestjs/graphql';
import { ELocales, ILocales } from '../locales/locales.interface.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { Category } from '../category/category.entity';

@ObjectType({ implements: [INode] })
export class Sentence implements INode {

    id: string

    @Field()
    displayText: string

    @Field(() => ELocales)
    lang: ELocales

    @Field()
    normalized: string

    @Field()
    slug: string
    // @Field(() => Category)
    // protected category: Promise<Category>

}


@ObjectType()
export class LinkedSentences {

    @Field(() => Sentence)
    from: Sentence
    @Field(() => Sentence)
    to: Sentence
}


