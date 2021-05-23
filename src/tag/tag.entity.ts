import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ILocales } from '../locales/locales.interface.entity';

@ObjectType({ implements: [ILocales] })
export class Tag extends INode<Tag> {
    @Field()
    slug: string;

}