import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';

@Module({
  providers: [RestaurantService],
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    CacheModule.register(),
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
