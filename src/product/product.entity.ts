import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class ProductEntity {
    @Field()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    description: string;

    @Field()
    @Column()
    history: string;

    @Field()
    @Column()
    category: string;

    @Field((type) => GastronomicCultureEntity)
    @ManyToOne(() => GastronomicCultureEntity, (gastronomicCulture) => gastronomicCulture.products)
    gastronomicCulture: GastronomicCultureEntity;
}
