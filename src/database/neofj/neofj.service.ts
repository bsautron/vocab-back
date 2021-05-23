import { Inject, Injectable, Logger } from "@nestjs/common";
import {
    validateOrReject,
} from 'class-validator';
import { v4 as uuid } from 'uuid'
import { INode } from "./neofj.resolver";

@Injectable()
export class NeofjService {
    private readonly logger = new Logger(NeofjService.name);

    constructor(
        @Inject('neo4j') protected readonly neo4j
    ) { }

    async run(query, variables?) {
        this.logger.log(query)
        this.logger.debug({ variables })
        const session = this.neo4j.session()
        const res = await session.run(query, variables)
        this.logger.debug({ res })
        return res
    }

    async create<T, P = Omit<T, 'id'>>(instencor: (new (props: P) => INode<T>), payload: P): Promise<void> {
        const data = new instencor(payload)
        try {
            await validateOrReject(data);
        } catch (errors) {
            this.logger.error(`Validation error of ${errors[0].target.constructor.name}`, JSON.stringify(errors[0].constraints))
            throw errors
        }

        const id = uuid()
        const props = [`id: "${id}"`]
        for (const prop in data) {
            props.push(`${prop}: $${prop}`)
        }
        const query = `CREATE (item:${data.constructor.name} {${props.join(', ')}})`
        return this.run(query, data)
    }
}
