import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { SlugCategory } from '../category/category.entity';

@ObjectType({ implements: [INode] })
export class Sentence implements INode {
    id: string

    @Field()
    displayText: string

    @Field(() => SlugCategory)
    slugCategory: SlugCategory
}



@ObjectType({})
export class SlugSentence{
    @Field()
    slug: string
    
    @Field(() => Sentence)
    sentence: Sentence
}