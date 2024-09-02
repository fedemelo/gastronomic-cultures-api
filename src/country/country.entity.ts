import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity()
export class CountryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
  restaurants: RestaurantEntity[];

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
