import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';

@Injectable()
export class CountryService {
  cacheKey: string = 'countries';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
  ) {}

  async findAll(): Promise<CountryEntity[]> {
    const cached: CountryEntity[] = await this.cacheManager.get<
      CountryEntity[]
    >(this.cacheKey);

    if (!cached) {
      const countries: CountryEntity[] = await this.countryRepository.find({
        relations: ['restaurants', 'gastronomicCultures'],
      });
      await this.cacheManager.set(this.cacheKey, countries);
      return countries;
    }

    return cached;
  }

  async findOne(id: string): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id },
      relations: ['restaurants', 'gastronomicCultures'],
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return country;
  }

  async create(country: CountryEntity): Promise<CountryEntity> {
    await this.validateUniqueCountryName(country.name);
    return await this.countryRepository.save(country);
  }

  async update(id: string, country: CountryEntity): Promise<CountryEntity> {
    const persistedCountry: CountryEntity =
      await this.countryRepository.findOne({ where: { id } });
    if (!persistedCountry)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.countryRepository.save({
      ...persistedCountry,
      ...country,
    });
  }

  async delete(id: string) {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { id },
    });
    if (!country)
      throw new BusinessLogicException(
        'The country with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.countryRepository.remove(country);
  }

  private async validateUniqueCountryName(name: string): Promise<void> {
    const country: CountryEntity = await this.countryRepository.findOne({
      where: { name },
    });

    if (country) {
      throw new BusinessLogicException(
        'A country with the given name already exists',
        BusinessError.ALREADY_EXISTS,
      );
    }
  }
}
