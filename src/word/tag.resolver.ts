import { Inject } from '@nestjs/common';
import { Args, Resolver, Query } from '@nestjs/graphql';
import { Tag } from './tag.entity';
import { TagService } from './tag.service';

@Resolver(of => Tag)
export class TagResolver {
    constructor(
        @Inject(TagService) protected tagService: TagService,
    ) { }

    @Query(type => [Tag])
    async searchTags(@Args('query') query: string): Promise<Tag[]> {
        return this.tagService.searchTag(query)
    }
}
