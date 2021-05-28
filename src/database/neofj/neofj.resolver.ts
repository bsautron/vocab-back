import { Field, ID, InterfaceType } from "@nestjs/graphql";
import { IsUUID, validateSync } from "class-validator";
import { v4 as uuid } from 'uuid'

export type ValidNode<T extends INode> = T & { _isValid: true }

@InterfaceType()
export abstract class INode {
    @IsUUID()
    @Field(() => ID)
    id: string;

    _isValid?: boolean


    static createNodeWithId<T extends INode>(c: new () => T, props: { [K in keyof T]?: T[K] }): ValidNode<T> {
        return this.createNode(c, { ...props, id: uuid() })
    }

    static createNode<T extends INode>(c: new () => T, props: { [K in keyof T]?: T[K] }): ValidNode<T> {
        const instance = new c()

        for (const key in props) {
            instance[key] = props[key]
        }
        const err = validateSync(instance as Record<string, unknown>)
        if (err?.length) {
            throw err[0]
        }
        instance._isValid = true
        return instance as T & { _isValid: true }
    }
}