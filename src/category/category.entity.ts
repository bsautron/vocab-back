import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [ILocales] })
export class Category extends INode {
    @Field(() => [Tag], { nullable: true })
    tags?: Tag[];
}
