import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //TODO: Add the missing properties @fedemelo

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
