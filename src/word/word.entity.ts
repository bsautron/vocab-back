import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Tag } from './tag.entity';

@ObjectType()
@Entity()
export class Word {
    @Field(type => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    fr: string;

    @Field()
    @Column()
    es: string;

    @Field(type => [Tag])
    @ManyToMany(type => Tag, { eager: true }) // note: we will create author property in the Photo class below
    @JoinTable()
    tags: Tag[];
}