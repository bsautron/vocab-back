import { ObjectType } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { User } from '../user/user.entity';
import { INode } from '../database/neofj/neofj.resolver';

// @ObjectType({ implements: [ILocales] })
export class Sentence implements INode, ILocales {

    id: string
    fr?: string;
    es?: string;


    // @Field(() => Category)
    // category: Promise<Category> | Category

}


