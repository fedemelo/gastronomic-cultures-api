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
import { ProductEntity } from '../product/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class GastronomicCultureEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  description: string;

  @Field(() => [RecipeEntity])
  @OneToMany(() => RecipeEntity, (recipe) => recipe.gastronomicCulture)
  recipes: RecipeEntity[];

  @Field(() => [CountryEntity])
  @ManyToMany(() => CountryEntity, (country) => country.gastronomicCultures)
  @JoinTable()
  countries: CountryEntity[];

  @Field(() => [RestaurantEntity])
  @ManyToMany(
    () => RestaurantEntity,
    (restaurant) => restaurant.gastronomicCultures,
  )
  @JoinTable()
  restaurants: RestaurantEntity[];

  // TODO: @dburgos26 - Add the missing relationship
  @OneToMany(() => ProductEntity, (product) => product.gastronomicCulture)
  products: ProductEntity[];
}
