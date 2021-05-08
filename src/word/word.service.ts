import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { Word } from './word.entity';
import { WordFilters } from './word.resolver';

@Injectable()
export class WordService {
    constructor(@InjectRepository(Word) protected wordsRepository: Repository<Word>) { }
    async getOneRandomWordByFilters(filters?: WordFilters[]): Promise<Word> {
        return this.wordsRepository.findOneOrFail()

        //     SELECT
        //     *
        // FROM
        //     table_name OFFSET floor(random() * (
        //         SELECT
        //             COUNT(*)
        //             FROM table_name))
        // LIMIT 1;
        // return qb.getOneOrFail()
    }
}
