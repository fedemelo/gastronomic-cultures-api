import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RestaurantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  michelinStars: number;

  @Column()
  awardDate: Date;

  @ManyToOne(() => CountryEntity, (country) => country.restaurants)
  country: CountryEntity;

  @ManyToMany(
    () => GastronomicCultureEntity,
    (gastronomicCulture) => gastronomicCulture.restaurants,
  )
  gastronomicCultures: GastronomicCultureEntity[];
}
