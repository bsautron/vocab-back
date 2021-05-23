import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { INode } from '../database/neofj/neofj.resolver';

@ObjectType()
export class User extends INode<User> {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    name: string;

}
