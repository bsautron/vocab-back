import { Field, ObjectType } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { Tag } from '../tag/tag.entity';

@ObjectType()
export class Category extends ILocales {
    @Field(() => [Tag])
    tags: Tag[];
}
