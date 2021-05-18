import { Field, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tag } from '../tag/tag.entity';

@ObjectType()
@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ unique: true })
    slug: string

    @Field(() => Locales)
    @Column({
        type: 'jsonb'
    })
    locales: Locales;

    @Field(() => [Tag])
    @ManyToMany(() => Tag, { eager: true, cascade: true })
    @JoinTable()
    tags: Tag[];
}
