import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findAll(): Promise<RestaurantEntity[]> {
    return await this.restaurantRepository.find({
      relations: ['gastronomicCultures'],
    });
  }

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id },
        relations: ['gastronomicCultures'],
      });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return restaurant;
  }

  async create(restaurant: RestaurantEntity): Promise<RestaurantEntity> {
    this.validateMichelinStars(restaurant.michelinStars);
    this.validateAwardDate(restaurant.awardDate);

    return await this.restaurantRepository.save(restaurant);
  }

  async update(
    id: string,
    restaurant: RestaurantEntity,
  ): Promise<RestaurantEntity> {
    const persistedRestaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({ where: { id } });
    if (!persistedRestaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    this.validateMichelinStars(restaurant.michelinStars);
    this.validateAwardDate(restaurant.awardDate);

    return await this.restaurantRepository.save({
      ...persistedRestaurant,
      ...restaurant,
    });
  }

  async delete(id: string) {
    const restaurant: RestaurantEntity =
      await this.restaurantRepository.findOne({
        where: { id },
      });
    if (!restaurant)
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.restaurantRepository.remove(restaurant);
  }

  private validateMichelinStars(michelinStars: number) {
    if (michelinStars > 3) {
      throw new BusinessLogicException(
        'A restaurant cannot have more than 3 Michelin stars',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }

  private validateAwardDate(awardDate: Date) {
    if (awardDate > new Date()) {
      throw new BusinessLogicException(
        'The award date cannot be in the future',
        BusinessError.PRECONDITION_FAILED,
      );
    }
  }
}
