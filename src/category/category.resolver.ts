import { Field, InputType, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { Tag } from '../tag/tag.entity';
import { ALocales } from '../locales/locales.interface.entity';
import { AddTagPayload } from '../tag/tag.resolver';
import { Category } from './category.entity';
import { TagService } from '../tag/tag.service';
import { CategoryService } from './category.service';

@InputType()
export class AddCategoryPayload implements ALocales {

    @Field()
    slug: string

    @Field(() => [AddTagPayload])
    tags: AddTagPayload[]

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}


@Resolver(() => Category)
export class CategoryResolver {
    constructor(
        protected tagService: TagService,
        protected categoryService: CategoryService,
    ) { }

    @Query(() => [Category])
    async categories(): Promise<Category[]> {
        return this.categoryService.getCategories()
    }

    @ResolveField()
    async tags(@Parent() category: Category): Promise<Tag[]> {
        return this.tagService.tagsByCetagoryId(category.id)
    }
}
