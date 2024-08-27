import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GastronomicCultureRestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    private readonly gastronomicCultureService: GastronomicCultureService,
    private readonly restaurantService: RestaurantService,
  ) {}

  async addRestaurantToGastronomicCulture(
    gastronomicCultureId: string,
    restaurantId: string,
  ): Promise<GastronomicCultureEntity> {
    const restaurant = await this.restaurantService.findOne(restaurantId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    gastronomicCulture.restaurants = [
      ...gastronomicCulture.restaurants,
      restaurant,
    ];
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }

  async findRestaurantByGastronomicCultureIdAndRestaurantId(
    gastronomicCultureId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantService.findOne(restaurantId);
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const restaurantFound = gastronomicCulture.restaurants.find(
      (restaurantEntity: RestaurantEntity) =>
        restaurantEntity.id === restaurant.id,
    );
    if (!restaurantFound) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return restaurant;
  }

  async findRestaurantsByGastronomicCultureId(
    gastronomicCultureId: string,
  ): Promise<RestaurantEntity[]> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    return gastronomicCulture.restaurants;
  }

  async associateRestaurantsToGastronomicCulture(
    gastronomicCultureId: string,
    restaurants: RestaurantEntity[],
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    for (const restaurant of restaurants) {
      await this.restaurantService.findOne(restaurant.id);
    }
    gastronomicCulture.restaurants = restaurants;
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }

  async deleteRestaurantFromGastronomicCulture(
    gastronomicCultureId: string,
    restaurantId: string,
  ): Promise<void> {
    const restaurant = await this.restaurantService.findOne(restaurantId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const restaurantFound = gastronomicCulture.restaurants.find(
      (restaurantEntity: RestaurantEntity) =>
        restaurantEntity.id === restaurant.id,
    );
    if (!restaurantFound) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gastronomicCulture.restaurants = gastronomicCulture.restaurants.filter(
      (restaurantEntity: RestaurantEntity) =>
        restaurantEntity.id !== restaurant.id,
    );
    await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
}
