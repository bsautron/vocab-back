import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { AddTagPayload } from './tag.resolver';

@Injectable()
export class TagService {
    constructor(@InjectRepository(Tag) protected tagsRepository: Repository<Tag>) { }

    async searchTag(query: string): Promise<Tag[]> {
        if (!query.length) return []
        return this.tagsRepository.createQueryBuilder('t')
            .where('t.slug LIKE :query', { query: `%${query}%` })
            .getMany()
    }

    async addTag(tag: AddTagPayload): Promise<Tag> {
        await this.tagsRepository.createQueryBuilder()
            .insert()
            .values([tag])
            .onConflict(`("slug") DO NOTHING`)
            .execute();
        return this.getTagBySlug(tag.slug)

    }

    async getTagBySlug(slug: string): Promise<Tag> {
        return this.tagsRepository.createQueryBuilder('t')
            .where('t.slug = :slug', { slug })
            .getOne()
    }
}
