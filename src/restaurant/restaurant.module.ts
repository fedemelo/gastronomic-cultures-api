import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { RestaurantResolver } from './restaurant.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [RestaurantService, RestaurantResolver],
  imports: [
    TypeOrmModule.forFeature([RestaurantEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [RestaurantController],
})
export class RestaurantModule {}
