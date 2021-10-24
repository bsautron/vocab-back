import { Args, Field, InputType, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Tag } from '../tag/tag.entity';
import { ILocales } from '../locales/locales.interface.entity';
import { Category, CategoryPreview } from './category.entity';
import { TagService } from '../tag/tag.service';
import { CategoryService } from './category.service';

@InputType()
export class AddCategoryPayload implements ILocales {

    @Field({ nullable: true })
    slug: string

    @Field({ nullable: true })
    image?: string

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;
}

@InputType()
export class SearchCategoriesPayload implements ILocales {

    @Field({ nullable: true })
    search?: string

    @Field({ nullable: true })
    id?: string

    @Field({ nullable: true })
    slug?: string

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

    @Mutation(() => [Category])
    async addCategories(@Args({ name: 'categories', type: () => [AddCategoryPayload] }) categories: AddCategoryPayload[]): Promise<Category[]> {
        return Promise.all(categories.map(category => this.categoryService.addCategory(category)))
    }

    @Query(() => [Category])
    async categories(@Args({ name: 'filters', type: () => SearchCategoriesPayload, nullable: true }) filters?: SearchCategoriesPayload): Promise<Category[]> {
        return this.categoryService.searchCategories(filters)
    }

    @ResolveField()
    async tags(@Parent() category: Category): Promise<Tag[]> {
        return this.tagService.tagsByCategorySlug(category.slug)
    }
}


@Resolver(() => CategoryPreview)
export class CategoryPreviewResolver {
    constructor(
        protected categoryService: CategoryService,
    ) {

    }
    @Query(() => [CategoryPreview])
    async categoryPreviews(@Args({ name: 'search' }) search: string): Promise<CategoryPreview[]> {
        return this.categoryService.previewCategories(search)
    }

}