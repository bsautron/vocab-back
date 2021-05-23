import { Injectable } from '@nestjs/common';
import { NeofjService } from '../database/neofj/neofj.service';
import { Tag } from './tag.entity';
import { AddTagPayload } from './tag.resolver';

@Injectable()
export class TagService {
    constructor(protected neofjService: NeofjService) { }

    async tagsByCetagoryId(categoryId: string): Promise<Tag[]> {
        const { records } = await this.neofjService.run('MATCH (c:Category {id: $id})-[:HAVE_TAG]->(t:Tag) return DISTINCT t', { id: categoryId })
        return records.map(({ _fields }) => _fields[0].properties)
    }
}
