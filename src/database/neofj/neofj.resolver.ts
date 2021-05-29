import { Field, ID, InterfaceType } from "@nestjs/graphql";
import { IsUUID, validateSync } from "class-validator";
import { v4 as uuid } from 'uuid'

export type ValidNode<T extends INode> = T & { _isValid: true }
export type NodeForCreation<T extends INode> = { alias: string, properties: ValidNode<T> }
export type CreateNodeOption<T extends INode> = {
    alias: string,
    instancor: new () => T,
    props: { [K in keyof T]?: T[K] }
}
export type CreateRelationshipOption = {
    alias: string,
    props: {
        id: string,
        [key: string]: unknown
    }
}
export type RelationLinked = {
    [key: string]: unknown
}

@InterfaceType()
export abstract class INode {
    @IsUUID()
    @Field(() => ID)
    id: string;

    _isValid?: boolean


    static linkRelationShips(relations: CreateRelationshipOption[]) {
        const ret = {}
        const relationsMap = new Map<string, unknown>()
        relations.forEach(({ alias, props }) => {
            if (relationsMap.has(alias)) {
                throw new Error('Conflit relation')
            }
            relationsMap.set(alias, props)
            ret[alias] = props
        })
        return ret

    }
    static createNodeWithId<T extends INode>(options: CreateNodeOption<T>): NodeForCreation<T> {
        return this.createNode({ ...options, props: { id: uuid(), ...options.props } })
    }

    static createNode<T extends INode>(options: CreateNodeOption<T>): NodeForCreation<T> {
        if (!options.props) {
            throw new Error('No props given')
        }
        const instance = new options.instancor()

        for (const key in options.props) {
            instance[key] = options.props[key]
        }
        const err = validateSync(instance as Record<string, unknown>)
        if (err?.length) {
            throw err[0]
        }
        instance._isValid = true
        return {
            alias: options.alias,
            properties: instance as T & { _isValid: true }
        }
    }
}