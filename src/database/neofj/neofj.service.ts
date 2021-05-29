import { Inject, Injectable, Logger } from "@nestjs/common";
import { INode, ValidNode } from "./neofj.resolver";

/**
 * Used for map alias -> properties
 */
interface ValidVariables {
    alias: string,
    properties: ValidNode<INode, any>
}
/**
 * One line to cumpute for neofj db
 */
interface QueryLine {
    query: string,
    variables?: ValidVariables[]
}

/**
 * Helper execute valid cmb and variables to neofj db thanks to typescript classes
 */
@Injectable()
export class NeofjService {
    private readonly logger = new Logger(NeofjService.name);

    constructor(
        @Inject('neo4j') protected readonly neo4j
    ) { }

    /**
     * Run multiline queries with mapped props
     * @param queries text queries, with their variables
     */
    async run(queries: QueryLine[]) {
        const mapVariables = new Map<string, unknown>()
        if (!queries || queries.length === 0) {
            throw new Error('No query given')
        }
        queries.forEach(q => {
            if (q.query.length === 0) {
                throw new Error('No query given')

            }
            if (q.variables) {
                for (const queryVar of q.variables) {
                    if (mapVariables.has(queryVar.alias)) {
                        throw new Error(`Alias Conflit: alias '${queryVar.alias}'`)
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _isValid, ...props } = queryVar.properties;
                    mapVariables.set(queryVar.alias, props)
                }
            }
        })
        const session = this.neo4j.session()

        const fullq = queries.map(q => q.query).join('\n')
        queries.forEach(q => this.logger.log(q.query.trim()))
        return session.run(fullq, mapVariables.size > 0 ? Object.fromEntries(Array.from(mapVariables.entries())) : undefined)
    }
}


