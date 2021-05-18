import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) protected usersRepository: Repository<User>
    ) { }

    async getUserById(id: string): Promise<User> {
        return this.usersRepository.findOneOrFail({ where: { id: id } })
    }
}
