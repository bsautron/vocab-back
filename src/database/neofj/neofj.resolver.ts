import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export abstract class INode<P> {
    constructor(props: Omit<P, 'id'>) {
        for (const prop in props) {
            this[prop] = props[prop]
        }
    }
    @Field(() => ID)
    id: string;
}