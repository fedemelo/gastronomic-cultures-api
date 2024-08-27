import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany } from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Add the missing properties @fedemelo

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
