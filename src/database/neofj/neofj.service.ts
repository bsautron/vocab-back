import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class NeofjService {
    constructor(@Inject('neo4j') protected readonly neo4j) { }

    async run(query, variables?) {
        try {
            console.log(query, variables)
            const session = this.neo4j.session()
            const res = await session.run(query, variables)
            return res
        } catch (err) {
            console.error(err)
            throw err
        }
    }
}