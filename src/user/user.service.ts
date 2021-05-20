import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { NeofjService } from '../database/neofj/neofj.service';

@Injectable()
export class UserService {
    constructor(
        protected neoService: NeofjService,
        @InjectRepository(User) protected usersRepository: Repository<User>
    ) { }

    async getUserById(id: string): Promise<User> {
        return this.usersRepository.findOneOrFail({ where: { id: id } })
    }
    async createUser({ name }: { name: string }) {
        return this.neoService.exec('CREATE (a:Person {name: $name}) RETURN a', { name })
    }
}
