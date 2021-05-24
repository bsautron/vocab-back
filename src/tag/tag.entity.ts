import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';
import { ALocales } from '../locales/locales.interface.entity';

@ObjectType({ implements: [ALocales] })
export class Tag extends INode<Tag> {
    @Field()
    slug: string;

}