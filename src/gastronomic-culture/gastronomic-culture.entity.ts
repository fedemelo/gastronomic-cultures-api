import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';

@Entity()
export class GastronomicCultureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => CountryEntity, (country) => country.gastronomicCultures)
  @JoinTable()
  countries: CountryEntity[];

  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.gastronomicCultures,
  )
  @JoinTable()
  restaurants: RestaurantEntity[];
}
