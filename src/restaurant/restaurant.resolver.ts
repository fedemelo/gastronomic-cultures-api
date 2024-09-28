import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantDto } from './restaurant.dto';
import { plainToInstance } from 'class-transformer';

@Resolver()
export class RestaurantResolver {
  constructor(private restaurantService: RestaurantService) {}

  @Query(() => [RestaurantEntity])
  restaurants(): Promise<RestaurantEntity[]> {
    return this.restaurantService.findAll();
  }

  @Query(() => RestaurantEntity)
  restaurant(@Args('id') id: string): Promise<RestaurantEntity> {
    return this.restaurantService.findOne(id);
  }

  @Mutation(() => RestaurantEntity)
  createRestaurant(
    @Args('restaurant') restaurantDto: RestaurantDto,
  ): Promise<RestaurantEntity> {
    const restaurant = plainToInstance(RestaurantEntity, {
      ...restaurantDto,
      awardDate: new Date(restaurantDto.awardDate),
    });
    return this.restaurantService.create(restaurant);
  }

  @Mutation(() => RestaurantEntity)
  updateRestaurant(
    @Args('id') id: string,
    @Args('restaurant') restaurantDto: RestaurantDto,
  ): Promise<RestaurantEntity> {
    const restaurant = plainToInstance(RestaurantEntity, {
      ...restaurantDto,
      awardDate: new Date(restaurantDto.awardDate),
    });
    return this.restaurantService.update(id, restaurant);
  }

  @Mutation(() => String)
  deleteRestaurant(@Args('id') id: string) {
    this.restaurantService.delete(id);
    return id;
  }
}
