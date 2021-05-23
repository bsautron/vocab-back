import { Field, ObjectType } from '@nestjs/graphql';
import { ILocales } from '../locales/locales.interface.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { INode } from '../database/neofj/neofj.resolver';

@ObjectType({ implements: [ILocales] })
export class Sentence extends INode {
    @Field(() => User)
    addedBy: Promise<User> | User

    @Field(() => Category)
    category: Promise<Category> | Category


}
