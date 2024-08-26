import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: Add the missing properties @fedemelo

  @ManyToOne(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCulture: GastronomicCultureEntity;
}
