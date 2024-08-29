/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Entity()
export class RecipeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    photo: string;

    @Column()
    preparationProcess: string;

    @Column()
    video: string;

    @ManyToOne(() => GastronomicCultureEntity, gastronomicCulture => gastronomicCulture.recipes)
    gastronomicCulture: GastronomicCultureEntity;

}
