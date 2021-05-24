import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ALocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [ALocales] })
export class Category extends INode<Category> implements ALocales {
    @Field()
    slug: string

    @Field({ nullable: true })
    image?: string

    @Field(() => [Tag], { nullable: true })
    tags?: Tag[];

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}
