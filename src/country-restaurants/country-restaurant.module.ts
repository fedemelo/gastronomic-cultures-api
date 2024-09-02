import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryEntity } from '../country/country.entity';
import { CountryRestaurantService } from './country-restaurant.service';
import { CountryRestaurantController } from './country-restaurant.controller';

@Module({
  providers: [CountryRestaurantService],
  imports: [TypeOrmModule.forFeature([CountryEntity, RestaurantEntity])],
  controllers: [CountryRestaurantController],
})
export class CountryRestaurantModule {}
