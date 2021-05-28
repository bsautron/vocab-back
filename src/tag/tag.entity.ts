import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';

@ObjectType({ implements: [INode, ILocales] })
export class Tag implements INode, ILocales {
    id: string
    fr?: string;
    es?: string;

    @Field()
    slug: string;

}