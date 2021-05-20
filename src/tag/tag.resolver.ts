import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, InputType, Field } from '@nestjs/graphql';
import { ILocales, } from '../locales/locales.interface.entity';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@InputType()
export class AddTagPayload extends ILocales {
    @Field()
    slug: string
}

@Resolver(() => Tag)
export class TagResolver {
    constructor(
        @Inject(TagService) protected tagService: TagService,
    ) { }


}
