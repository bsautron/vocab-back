import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class NeofjService {
    constructor(@Inject('session') protected readonly session) { }

    async run(query, variables?) {
        return this.session.run(query, variables)
    }
}