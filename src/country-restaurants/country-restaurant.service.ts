import { Injectable } from '@nestjs/common';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryEntity } from '../country/country.entity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CountryService } from '../country/country.service';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CountryRestaurantService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    private readonly countryService: CountryService,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
    private readonly restaurantService: RestaurantService,
  ) {}

  async addRestaurantCountry(
    countryId: string,
    restaurantId: string,
  ): Promise<CountryEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantService.findOne(restaurantId);
    const country: CountryEntity = await this.countryService.findOne(countryId);

    country.restaurants = [...country.restaurants, restaurant];
    return await this.countryService.update(countryId, country);
  }

  async findRestaurantByCountryIdRestaurantId(
    countryId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantService.findOne(restaurantId);
    const country: CountryEntity = await this.countryService.findOne(countryId);

    const countryRestaurant: RestaurantEntity = country.restaurants.find(
      (e) => e.id === restaurant.id,
    );

    if (!countryRestaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the country',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return countryRestaurant;
  }

  async findRestaurantsByCountryId(
    countryId: string,
  ): Promise<RestaurantEntity[]> {
    const country: CountryEntity = await this.countryService.findOne(countryId);
    return country.restaurants;
  }

  async associateRestaurantsCountry(
    countryId: string,
    restaurants: RestaurantEntity[],
  ): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryService.findOne(countryId);

    for (const restaurantItem of restaurants) {
      await this.restaurantService.findOne(restaurantItem.id);
    }

    country.restaurants = restaurants;
    return await this.countryService.update(countryId, country);
  }

  async deleteRestaurantCountry(
    countryId: string,
    restaurantId: string,
  ): Promise<void> {
    const restaurant: RestaurantEntity =
      await this.restaurantService.findOne(restaurantId);
    const country: CountryEntity = await this.countryService.findOne(countryId);

    const countryRestaurant: RestaurantEntity = country.restaurants.find(
      (e) => e.id === restaurant.id,
    );

    if (!countryRestaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the country',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    country.restaurants = country.restaurants.filter(
      (e) => e.id !== restaurantId,
    );
    await this.countryService.update(countryId, country);
  }
}
