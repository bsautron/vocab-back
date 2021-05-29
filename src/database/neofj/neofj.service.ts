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
        const fullq = queries.map(q => q.query).join('\n')

        /** Get all path and chek if it's in the query template */
        const propsPaths = queries
            .filter(q => q.variables?.length)
            .flatMap(q => q.variables?.flatMap(v => this.jsonToPaths('$' + v.alias, v.properties)))
            .filter(p => !p?.includes('_isValid'))
            .forEach(p => {
                if (!fullq.includes(p as string)) {
                    throw new Error(`Variable '${p}' provided but not found in the query`);
                }
            })

        const session = this.neo4j.session()

        queries.forEach(q => this.logger.log(q.query.trim()))
        return session.run(fullq, mapVariables.size > 0 ? Object.fromEntries(Array.from(mapVariables.entries())) : undefined)
    }

    /**
     * Transorfm the object to a list a all different path
     * @param prefix the prefix of the path, whill be join with a dot
     * @param obj the obj to transform
     */
    protected jsonToPaths(prefix: string, obj: Record<string, unknown>) {
        const ret: string[] = []
        if (prefix) ret.push(prefix)
        if (!obj) return ret
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                ret.push(...this.jsonToPaths(`${prefix}.${key}`, obj[key] as Record<string, unknown>))
            } else {
                ret.push(`${prefix ? prefix + '.' : ''}${key}`)
            }
        }
        return ret
    }
}


