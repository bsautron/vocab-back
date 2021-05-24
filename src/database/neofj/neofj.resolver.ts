import { Field, ID, ObjectType } from "@nestjs/graphql";


@ObjectType()
export abstract class INode<T> {
    constructor(props: { [K in keyof INode<T>]?: INode<T>[K] }) {
        for (const prop in props) {
            this[prop] = props[prop]
        }
    }
    @Field(() => ID)
    id: string;
}