import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, InputType, Field } from '@nestjs/graphql';
import { ALocales, } from '../locales/locales.interface.entity';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@InputType()
export class AddTagPayload implements ALocales {
    @Field()
    slug: string

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}

@Resolver(() => Tag)
export class TagResolver {
    constructor(
        @Inject(TagService) protected tagService: TagService,
    ) { }


}
