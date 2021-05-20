import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType()
export class Word {
    @Field(() => ID)
    id: string;

    @Field(() => Locales)
    locales: Locales;

    @Field(() => [Tag])
    tags: Tag[];
}