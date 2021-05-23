import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export abstract class INode {
    @Field(() => ID)
    id: string;
}