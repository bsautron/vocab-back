import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType({ implements: [INode, ILocales] })
export class Word implements INode, ILocales {
    id: string
    fr?: string;
    es?: string;

    // @Field(() => [Tag])
    tags: Tag[];
}