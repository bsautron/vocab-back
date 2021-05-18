import { Field, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Tag {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column({ unique: true })
    slug: string;

    @Field(() => Locales)
    @Column({
        type: 'jsonb'
    })
    locales: Locales;

}