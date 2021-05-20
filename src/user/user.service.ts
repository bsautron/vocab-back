import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';

@Injectable()
export class UserService {
    constructor(
        protected neoService: NeofjService,
    ) { }

    async createUser({ name }: { name: string }) {
        return this.neoService.run('CREATE (a:Person {name: $name}) RETURN a', { name })
    }
}
