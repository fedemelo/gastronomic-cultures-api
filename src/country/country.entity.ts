import { Field, ObjectType } from '@nestjs/graphql';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@ObjectType()
@Entity()
export class CountryEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // TODO: @fedemelo - Add the missing fields
  @Column()
  name: string;

  // TODO: @fedemelo - Add the missing fields
  @OneToMany(() => RestaurantEntity, (restaurant) => restaurant.country)
  restaurants: RestaurantEntity[];

  @Field(() => [GastronomicCultureEntity])
  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.countries,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
