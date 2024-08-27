import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantEntity } from './restaurant.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly restaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async findOne(id: string): Promise<RestaurantEntity> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['gastronomicCulture'],
    });
    if (!restaurant) {
      throw new BusinessLogicException(
        'The restaurant with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return restaurant;
  }

  // TODO: Additional methods like get all, create, update, delete are missing @fedemelo
  // Add the missing methods and adjust the previous methods to use the new entity properties
}
