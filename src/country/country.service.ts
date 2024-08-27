import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountryEntity } from './country.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findOne(id: string): Promise<CountryEntity> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['gastronomicCultures'],
    });
    if (!country) {
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return country;
  }

  // TODO: Additional methods like get all, create, update, delete are missing @fedemelo
  // Add the missing methods and adjust the previous methods to use the new entity properties
}
