import { Field, ObjectType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
import { Sentence } from 'src/sentence/sentence.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [INode, ILocales] })
export class Category implements INode, ILocales {
    id: string
    fr?: string;
    es?: string;

    @Field()
    slug: string

    @Field({ nullable: true })
    @Matches(/\.png$/)
    image?: string

    @Field(() => [Tag], { nullable: true })
    tags?: Tag[];
}


@ObjectType({ implements: [ILocales] })
export class CategoryPreview implements ILocales {
    fr?: string;
    es?: string;

    @Field()
    slug: string

    @Field({ nullable: true })
    @Matches(/\.png$/)
    image?: string


    @Field(() => [Sentence], { nullable: true })
    sentencePreviews?: Sentence[]

}