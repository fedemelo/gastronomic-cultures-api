/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class RecipeEntity {
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
    photo: string;

    @Field()
    @Column()
    preparationProcess: string;

    @Field()
    @Column()
    video: string;

    @Field((type) => GastronomicCultureEntity)
    @ManyToOne(() => GastronomicCultureEntity, (gastronomicCulture) => gastronomicCulture.recipes)
    gastronomicCulture: GastronomicCultureEntity;

}
