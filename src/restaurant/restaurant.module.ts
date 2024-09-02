import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Module({
  providers: [RestaurantService],
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],
})
export class RestaurantModule {}
