/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { CountryEntity } from '../country/country.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CountryRestaurantService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,

    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async addRestaurantCountry(
    countryId: string,
    restaurantId: string,
  ): Promise<CountryEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['restaurants', 'gastronomicCultures'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    country.restaurants = [...country.restaurants, restaurant];
    return await this.countryRepository.save(country);
  }

  async findRestaurantByCountryIdRestaurantId(
    countryId: string,
    restaurantId: string,
  ): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['restaurants'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const countryRestaurant: RestaurantEntity = country.restaurants.find(
      (e) => e.id === restaurant.id,
    );

    if (!countryRestaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the country',
        BusinessError.PRECONDITION_FAILED,
      );

    return countryRestaurant;
  }

  async findRestaurantsByCountryId(
    countryId: string,
  ): Promise<RestaurantEntity[]> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['restaurants'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return country.restaurants;
  }

  async associateRestaurantsCountry(
    countryId: string,
    restaurants: RestaurantEntity[],
  ): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['restaurants'],
    });

    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (const restaurantItem of restaurants) {
      const restaurant: RestaurantEntity =
        await this.restaurantRepository.findOne({
          where: { id: restaurantItem.id },
        });
      if (!restaurant)
        throw new BusinessLogicException(
          'The restaurant with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    country.restaurants = restaurants;
    return await this.countryRepository.save(country);
  }

  async deleteRestaurantCountry(countryId: string, restaurantId: string) {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id: restaurantId } });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id: countryId },
      relations: ['restaurants'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const countryRestaurant: RestaurantEntity = country.restaurants.find(
      (e) => e.id === restaurant.id,
    );

    if (!countryRestaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id is not associated to the country',
        BusinessError.PRECONDITION_FAILED,
      );

    country.restaurants = country.restaurants.filter(
      (e) => e.id !== restaurantId,
    );
    await this.countryRepository.save(country);
  }
}
