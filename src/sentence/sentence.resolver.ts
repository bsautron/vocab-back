import { Args, Field, InputType, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { NeofjService } from '../database/neofj/neofj.service';
import { ILocales } from '../locales/locales.interface.entity';
import { Sentence } from './sentence.entity';
import { SentenceService } from './sentence.service';
import { Category } from '../category/category.entity';
import { INode } from '../database/neofj/neofj.resolver';

@InputType()
export class SentenceRelationsCategoryPayload {
    @Field()
    id: string
}

@InputType()
export class SentenceRelationsPayload {
    @Field(() => SentenceRelationsCategoryPayload)
    category: SentenceRelationsCategoryPayload
}

@InputType()
export class AddSentencePayload implements ILocales {

    @Field(() => SentenceRelationsPayload)
    relations: SentenceRelationsPayload;

    @Field({ nullable: true })
    fr?: string;

    @Field({ nullable: true })
    es?: string;

}


@Resolver(() => Sentence)
export class SentenceResolver {
    constructor(
        protected neofjService: NeofjService,
        protected sentenceService: SentenceService,
    ) { }

    // // TODO: Toujours en filters
    // @Query(() => [Sentence])
    // async sentences(@Args({ name: 'category', type: () => String }) category: string): Promise<Sentence[]> {
    //     // Faire des match differents selon les ARGS
    //     // Toujour return un seul type de node (ici r)
    //     // Meme si je complexify lq query
    //     // les fieldresolver iront rematcher les sous node

    //     const { records } = await this.neofjService.run('MATCH (s:Sentence)-[:BELONGS_TO]->(c:Category { slug: $category.slug }) RETURN s', [{
    //         name: 'category',
    //         properties: INode.createNode(Category, { slug: category })
    //     }])
    //     const res = records.map(record => record.s.properties)
    //     console.log('res:', res) /* dump variable */
    //     return res
    // }

    // @ResolveField(() => Category)
    // async category(@Parent() sentence: Sentence): Promise<Category> {
    //     const { records } = await this.neofjService.run('MATCH (s:Sentence {id: $sentence.id})-[:BELONGS_TO]->(c:Category) return DISTINCT c', [{
    //         alias: 'sentence',
    //         properties: INode.createNode(Sentence, { id: sentence.id })
    //     }])
    //     return records[0].c.properties
    // }

    @Mutation(() => Sentence)
    async addNewSentence(@Args('sentence') sentence: AddSentencePayload): Promise<Sentence> {
        return this.sentenceService.addNewSentence(sentence)
    }
}
