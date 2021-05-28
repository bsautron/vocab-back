import { Field, ObjectType } from '@nestjs/graphql';
import { Matches } from 'class-validator';
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
