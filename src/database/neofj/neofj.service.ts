import { Inject, Injectable, Logger } from "@nestjs/common";

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
}