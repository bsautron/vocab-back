import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from '../tag/tag.entity';

@ObjectType()
@Entity()
export class Word {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

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