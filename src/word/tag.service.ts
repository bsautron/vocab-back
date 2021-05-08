import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) protected tagsRepository: Repository<Tag>) { }

    async searchTag(query: string): Promise<Tag[]> {
        if (!query.length) return []
        return this.tagsRepository.createQueryBuilder('t')
            .where('t.name LIKE :query', { query: `%${query}%` })
            .getMany()
    }
}
