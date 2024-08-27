import { Module } from '@nestjs/common';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';

@Module({
  providers: [GastronomicCultureRestaurantService]
})
export class GastronomicCultureRestaurantModule {}
