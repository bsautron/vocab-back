import { Field, ObjectType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { Sentence } from 'src/sentence/sentence.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [INode] })
export class Category implements INode {
    id: string

    @Field()
    displayText: string
}


@ObjectType()
export class SlugCategory {
    @Field()
    slug: string
}

@ObjectType()
export class PreviewCategory extends SlugCategory {
    @Field(() => Category)
    categories: Category[]

    @Field(() => [Sentence])
    sentences: Sentence[]
}