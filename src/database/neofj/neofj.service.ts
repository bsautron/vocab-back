import { Inject, Injectable, Logger } from "@nestjs/common";
import {
    validateOrReject, validateSync,
} from 'class-validator';
import { User } from "../../user/user.entity";
import { v4 as uuid } from 'uuid'
import { INode, ValidNode } from "./neofj.resolver";
import { Sentence } from "../../sentence/sentence.entity";
import { Transaction } from "neo4j-driver";

interface ValidVariables {
    alias: string,
    properties: ValidNode<INode>
}
interface ValidRelationship {
    alias: string,
    props: {
        id: string,
        [key: string]: unknown
    }
}

interface QueryLine {
    query: string,
    variables?: ValidVariables[]
}
@Injectable()
export class NeofjService {
    private readonly logger = new Logger(NeofjService.name);

    constructor(
        @Inject('neo4j') protected readonly neo4j
    ) { }


    // async run(query: string, variables: ValidVariables[] = [], relationsShip: ValidRelationship[] = [], transaction?: Transaction) {
    //     const session = !transaction ? this.neo4j.session() : null
    //     this.logger.log(query)
    //     this.logger.debug({ variables })
    //     const formatedVariables = Object.fromEntries(variables.map(v => [v.alias, v.properties]));
    //     console.log('relationsShip:', relationsShip) /* dump variable */
    //     if (session) {
    //         return session.run(query, formatedVariables)
    //     }
    //     return transaction.run(query, formatedVariables)
    //     // this.logger.debug({ res })
    // }


    async run(query: QueryLine[] = []) {
        const mapVariables = new Map<string, unknown>()
        if (!query || query.length === 0) {
            throw new Error('No query given')
        }
        query.forEach(q => {
            if (q.query.length === 0) {
                throw new Error('No query given')

            }
            if (q.variables) {
                for (const queryVar of q.variables) {
                    if (mapVariables.has(queryVar.alias)) {
                        throw new Error(`Alias Conflit: alias '${queryVar.alias}'`)
                    }
                    const { _isValid, ...props } = queryVar.properties;
                    mapVariables.set(queryVar.alias, props)
                }
            }
        })
        const session = this.neo4j.session()
        const fullq = query.map(q => q.query).join('\n')
        await session.run(fullq, mapVariables.size > 0 ? Object.fromEntries(Array.from(mapVariables.entries())) : undefined)
    }
}

// async createOne<T>(
//     instencor: (new (props: { [K in keyof INode<T>]?: INode<T>[K] }) => T),
//     payload: Partial<Omit<T, 'id'>>
// ) {
//     const data = new instencor(payload)
//     try {
//         await validateOrReject(data as Partial<Omit<T, 'id'>>);
//     } catch (errors) {
//         this.logger.error(`Validation error of ${errors[0].target.constructor.name}`, JSON.stringify(errors[0].constraints))
//         throw errors
//     }

//     const id = uuid()
//     const props = [`id: $id`]
//     for (const prop in data) {
//         props.push(`${prop}: $${prop}`)
//     }
//     const query = `CREATE (item:${data.constructor.name} {${props.join(', ')}}) return item`
//     const { records } = await this.run(query, { id, ...data })
//     return records[0].toObject()
// }

// async matchOne<T>(
//     instencor: (new (props: { [K in keyof INode<T>]?: INode<T>[K] }) => T),
//     payload: Partial<T>,
// ) {
//     const props = []
//     for (const prop in payload) {
//         props.push(`${prop}: $${prop}`)
//     }
//     const query = `MATCH (item:${instencor.name} {${props.join(', ')}}) return item`
//     const { records } = await this.run(query, payload)
//     if (records.length === 0) {
//         throw new Error(`No ${instencor.name} Found`)
//     }
//     return records[0].toObject()

// }
