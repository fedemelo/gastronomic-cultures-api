import { Module } from '@nestjs/common';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { GastronomicCultureRestaurantController } from './gastronomic-culture-restaurant.controller';

@Module({
  providers: [
    GastronomicCultureRestaurantService,
    GastronomicCultureService,
    RestaurantService,
  ],
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, RestaurantEntity]),
  ],
  controllers: [GastronomicCultureRestaurantController],
})
export class GastronomicCultureRestaurantModule {}
