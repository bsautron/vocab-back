import { Field, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';

@ObjectType()
export class Tag {
    id: string;

    @Field()
    slug: string;

    @Field(() => Locales)
    locales: Locales;

}