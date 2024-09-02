import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Entity()
export class ProductEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    history: string;

    @Column()
    category: string;

    @ManyToOne(() => GastronomicCultureEntity, (gastronomicCulture) => gastronomicCulture.products)
    gastronomicCulture: GastronomicCultureEntity;
}
