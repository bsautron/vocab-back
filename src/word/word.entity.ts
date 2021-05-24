import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ALocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [ALocales] })
export class Word extends INode<Word> {
    @Field(() => [Tag])
    tags: Tag[];
}