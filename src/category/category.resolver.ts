import { Field, InputType, Resolver } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { AddTagPayload } from '../tag/tag.resolver';

@InputType()
export class AddCategoryPayload extends ILocales {

    @Field()
    slug: string

    @Field(() => [AddTagPayload])
    tags: AddTagPayload[]
}


@Resolver()
export class CategoryResolver { }
