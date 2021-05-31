import { Field, ID, InterfaceType } from "@nestjs/graphql";
import { IsUUID, validateSync } from "class-validator";
import { v4 as uuid } from 'uuid'

/** type to declare the node as 'valid' */
export type ValidNode<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = P & { _isValid: true }
/** type used before creating a node in the driver.run / service.run */
export type NodeForCreation<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = { alias: string, properties: ValidNode<T, P> }
/** options for generate the instance of the node*/
export type CreateNodeOption<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>> = {
    alias: string,
    instancor: new () => T,
    props: P
}
/** map of properties of the class to a simple object */
export type Props<T extends INode> = {
    [P in keyof T]: T[P]
}
/** map of properties of the class without the node.id */
export type PropsWithoutId<T extends INode> = {
    [P in keyof T as Exclude<P, "id">]: T[P]
}
/** map of properties of the class to be all optional */
export type PropsOptional<T extends INode> = {
    [P in keyof T]+?: T[P]
}

/**
 * The abstract class to extends for all nodes
 * Provide the id
 * And validate the properties from class-validator
 */
@InterfaceType()
export abstract class INode {
    /** the required uuid for all nodes */
    // TODO: use this: https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-randomuuid
    @IsUUID()
    @Field(() => ID)
    id: string;


    //https://neo4j.com/docs/cypher-manual/current/functions/scalar/#functions-timestamp
    //createdAt, updatedAt, deletedAt

    /** setted only when used by the static node creation methods */
    _isValid?: boolean

    /**
     * Instanciate a node wih a generated id
     * Use it when before insert the node in the db
     * @param options options for create the node
     */
    static createNodeWithId<T extends INode>(options: CreateNodeOption<T, PropsWithoutId<T>>): NodeForCreation<T, Props<T>> {
        const props: Props<T> = { id: uuid() as string, ...options.props } as unknown as Props<T>
        return this.createGenericNode<T, Props<T>>({ ...options, props })
    }

    /**
     * Instanciate a node all keys of T optionally
     * Use it when before you whan match the node in the db
     * @param options options for create the node
     */
    static createNodeOptional<T extends INode>(options: CreateNodeOption<T, PropsOptional<T>>): NodeForCreation<T, PropsOptional<T>> | null {
        const allAreUndef = Object.keys(options.props).every(key => options.props[key] === undefined)
        if (allAreUndef) return null
        return this.createGenericNode<T, PropsOptional<T>>(options)
    }

    /**
     * Instanciate a node accepting all required and optional properties for T
     * Use it when you when transforme a simple object to an instance of you node
     * @param options options for create the node
     */
    static createNode<T extends INode>(options: CreateNodeOption<T, Props<T>>): NodeForCreation<T, Props<T>> {
        return this.createGenericNode<T, Props<T>>(options)
    }

    /**
     * Instanciate a INode after validate all properties
     * @param options options for create the node
     */
    protected static createGenericNode<T extends INode, P extends Props<T> | PropsWithoutId<T> | PropsOptional<T>>(options: CreateNodeOption<T, P>): NodeForCreation<T, P> {
        if (!options.props) {
            throw new Error('No props given')
        }
        const instance = new options.instancor()

        Object.keys(options.props).forEach(key => options.props[key] === undefined && delete options.props[key])
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