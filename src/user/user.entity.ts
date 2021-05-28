import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, validateOrReject } from 'class-validator';
import { INode } from '../database/neofj/neofj.resolver';

// @ObjectType({ implements: [INode] })
export class User implements INode {
    id: string

    // @Field()
    @IsEmail()
    email: string;

    // @Field()
    name: string;

}
