import { Field, ID, InterfaceType } from "@nestjs/graphql";
import { IsUUID, validateSync } from "class-validator";
import { v4 as uuid } from 'uuid'

export type ValidNode<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = P & { _isValid: true }
export type NodeForCreation<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = { alias: string, properties: ValidNode<T, P> }
export type CreateNodeOption<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = {
    alias: string,
    instancor: new () => T,
    props: P
}
export type Props<T extends INode> = {
    [P in keyof T]: T[P]
}
export type PropsWithoutId<T extends INode> = {
    [P in keyof T as Exclude<P, "id">]: T[P]
}
export type PropsOptional<T extends INode> = {
    [P in keyof T]+?: T[P]
}

@InterfaceType()
export abstract class INode {
    constructor() {
        // throw new Error("Should be use as an interface, don't extend this class");
    }

    @IsUUID()
    @Field(() => ID)
    id: string;


    _isValid?: boolean

    static createNodeWithId<T extends INode>(options: CreateNodeOption<T, PropsWithoutId<T>>): NodeForCreation<T, Props<T>> {
        const props: Props<T> = { id: uuid() as string, ...options.props } as unknown as Props<T>
        return this.createGenericNode<T, Props<T>>({ ...options, props })
    }
    static createNodeOptional<T extends INode>(options: CreateNodeOption<T, PropsOptional<T>>): NodeForCreation<T, PropsOptional<T>> {
        return this.createGenericNode<T, PropsOptional<T>>(options)
    }
    static createNode<T extends INode>(options: CreateNodeOption<T, Props<T>>): NodeForCreation<T, Props<T>> {
        return this.createGenericNode<T, Props<T>>(options)
    }

    protected static createGenericNode<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>>(options: CreateNodeOption<T, P>): NodeForCreation<T, P> {
        if (!options.props) {
            throw new Error('No props given')
        }
        const instance = new options.instancor()

        Object.assign(instance, options.props)
        const err = validateSync(instance as Record<string, unknown>, { skipMissingProperties: true })
        if (err?.length) {
            throw err[0]
        }
        instance._isValid = true
        return {
            alias: options.alias,
            properties: instance as ValidNode<T, P> & { _isValid: true }
        }
    }
}