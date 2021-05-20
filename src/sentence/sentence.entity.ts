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
    @ManyToOne(() => User, { lazy: true })
    addedBy: Promise<User> | User

    @Field(() => Category)
    @ManyToOne(() => Category, { lazy: true, cascade: true })
    category: Promise<Category> | Category
}
