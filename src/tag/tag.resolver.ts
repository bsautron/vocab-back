import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, InputType, Field } from '@nestjs/graphql';
import { AddLocalesPayload, Locales } from '../locales/locales.interface.entity';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@InputType()
export class AddTagPayload {
    @Field()
    slug: string

    @Field(() => AddLocalesPayload)
    locales: AddLocalesPayload
}

@Resolver(() => Tag)
export class TagResolver {
    constructor(
        @Inject(TagService) protected tagService: TagService,
    ) { }

    @Query(() => [Tag])
    async searchTags(@Args('query') query: string): Promise<Tag[]> {
        return this.tagService.searchTag(query)
    }
}
