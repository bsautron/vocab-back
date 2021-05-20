import { Field, ObjectType } from '@nestjs/graphql';
import { ILocales, Locales } from '../locales/locales.interface.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';

@ObjectType()
export class Sentence extends ILocales {
    @Field(() => User)
    addedBy: Promise<User> | User

    @Field(() => Category)
    category: Promise<Category> | Category
}
