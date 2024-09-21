import { Field, ObjectType } from '@nestjs/graphql';
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

  // TODO: @fedemelo - Add the missing fields
  @Column()
  city: string;

  // TODO: @fedemelo - Add the missing fields
  @Column()
  michelinStars: number;

  // TODO: @fedemelo - Add the missing fields
  @Column()
  awardDate: Date;

  // TODO: @fedemelo - Add the missing fields
  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;

  @Field(() => [GastronomicCultureEntity])
  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
