import { Module } from '@nestjs/common';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { GastronomicCultureRestaurantController } from './gastronomic-culture-restaurant.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [
    GastronomicCultureRestaurantService,
    GastronomicCultureService,
    RestaurantService,
  ],
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [GastronomicCultureRestaurantController],
})
export class GastronomicCultureRestaurantModule {}
