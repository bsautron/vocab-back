import { Injectable } from '@nestjs/common';
import { Category } from '../category/category.entity';
import { INode } from '../database/neofj/neofj.resolver';
import { NeofjService } from '../database/neofj/neofj.service';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
    constructor(protected neofjService: NeofjService) { }

    async tagsByCetagoryId(categoryId: string): Promise<Tag[]> {
        const { records } = await this.neofjService.run('MATCH (c:Category {id: $category.id})-[:HAVE_TAG]->(t:Tag) return DISTINCT t', [
            INode.createNode({
                c: Category,
                alias: 'category',

                props: {
                    id: categoryId
                }
            })
        ])
        console.log('records:', records) /* dump variable */
        return records.map(record => record.toObject().t.properties)
    }
}
