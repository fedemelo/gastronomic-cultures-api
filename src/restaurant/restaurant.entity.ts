/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class RestaurantEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  city: string;

  @Field(() => Int)
  @Column()
  michelinStars: number;

  @Field()
  @Column()
  awardDate: Date;

  @Field((type) => CountryEntity)
  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;

  @Field(() => [GastronomicCultureEntity])
  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
