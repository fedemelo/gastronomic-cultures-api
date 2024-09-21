import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryEntity } from '../country/country.entity';
import { CountryRestaurantService } from './country-restaurant.service';
import { CountryService } from '../country/country.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CountryRestaurantController } from './country-restaurant.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [CountryRestaurantService, CountryService, RestaurantService],
  imports: [
    TypeOrmModule.forFeature([CountryEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [CountryRestaurantController],
})
export class CountryRestaurantModule {}
