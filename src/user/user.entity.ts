import { Field, ObjectType } from '@nestjs/graphql';
import { INode } from '../database/neofj/neofj.resolver';

@ObjectType()
export class User extends INode {
    @Field()
    email: string;

    @Field()
    name: string;

}
