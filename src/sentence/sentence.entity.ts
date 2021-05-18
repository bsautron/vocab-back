import { Field, ObjectType } from '@nestjs/graphql';
import { Locales } from '../locales/locales.interface.entity';
import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from '../category/category.entity';

@ObjectType()
@Entity()
export class Sentence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => Locales)
    @Column({
        type: 'jsonb'
    })
    locales: Locales;

    @Field(() => User)
    @ManyToOne(() => User, { eager: true })
    addedBy: User

    @Field(() => Category)
    @ManyToOne(() => Category, { eager: true, cascade: true })
    category: Category
}
