import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    id: string;

    @Field()
    email: string;

    @Field()
    name: string;

}
