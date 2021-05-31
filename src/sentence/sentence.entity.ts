import { Field, ObjectType } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { Category } from '../category/category.entity';

@ObjectType({ implements: [INode, ILocales] })
export class Sentence implements INode, ILocales {

    id: string
    fr?: string;
    es?: string;


    @Field(() => Category)
    protected category: Promise<Category>

}


