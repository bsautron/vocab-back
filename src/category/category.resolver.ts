import { Field, InputType, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { Tag } from '../tag/tag.entity';
import { ILocales } from '../locales/locales.interface.entity';
import { AddTagPayload } from '../tag/tag.resolver';
import { Category } from './category.entity';

@InputType()
export class AddCategoryPayload implements ILocales {

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
    constructor(protected neofjService: NeofjService) { }

    @ResolveField()
    async tags(@Parent() category: Category): Promise<Tag[]> {
        const { records } = await this.neofjService.run('MATCH (c:Category {id: $id})-[:HAVE_TAG]->(t:Tag) return DISTINCT t', { id: category.id })
        return records.map(({ _fields }) => _fields[0].properties)
    }
}
