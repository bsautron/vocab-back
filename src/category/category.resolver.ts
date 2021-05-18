import { Field, InputType, Resolver } from '@nestjs/graphql';
import { Column } from 'typeorm';
import { AddLocalesPayload, Locales } from '../locales/locales.interface.entity';
import { AddTagPayload } from '../tag/tag.resolver';

@InputType()
export class AddCategoryPayload {

    @Field()
    @Column({ unique: true })
    slug: string

    @Field(() => AddLocalesPayload)
    locales: AddLocalesPayload

    @Field(() => [AddTagPayload])
    tags: AddTagPayload[]
}


@Resolver()
export class CategoryResolver { }
