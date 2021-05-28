import { Inject, Injectable, Logger } from "@nestjs/common";
import {
    validateOrReject, validateSync,
} from 'class-validator';
import { User } from "../../user/user.entity";
import { v4 as uuid } from 'uuid'
import { INode, ValidNode } from "./neofj.resolver";
import { Sentence } from "../../sentence/sentence.entity";

interface ValidVariables {
    alias: string,
    properties: ValidNode<INode>
}

@Injectable()
export class NeofjService {
    private readonly logger = new Logger(NeofjService.name);

    constructor(
        @Inject('neo4j') protected readonly neo4j
    ) { }


    async run(query, variables: ValidVariables[] = []) {
        this.logger.log(query)
        this.logger.debug({ variables })
        const session = this.neo4j.session()
        const formatedVariables = Object.fromEntries(variables.map(v => [v.alias, v.properties]));
        const res = await session.run(query, formatedVariables)
        // this.logger.debug({ res })
        return res
    }

}
// async validate<T extends Record<string, unknown>>(instansor: new () => T, props: { [K in keyof T]?: T[K] }) {
//     const item = new instansor()
//     for (const key in props) {
//         item[key] = props[key]
//     }

//     return validateOrReject(item)
// }

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
