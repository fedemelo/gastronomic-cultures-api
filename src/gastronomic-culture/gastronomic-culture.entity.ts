/* eslint-disable prettier/prettier */
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RecipeEntity } from '../recipe/recipe.entity';

@Entity()
export class GastronomicCultureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => RecipeEntity, (recipe) => recipe.gastronomicCulture)
  recipes: RecipeEntity[];

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
