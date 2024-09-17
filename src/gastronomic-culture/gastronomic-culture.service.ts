import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastronomicCultureService {
  cacheKey: string = 'gastronomicCulture';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
  ) {}

  async findAll(): Promise<GastronomicCultureEntity[]> {
    const cached: GastronomicCultureEntity[] = await this.cacheManager.get<
      GastronomicCultureEntity[]
    >(this.cacheKey);

    if (!cached) {
      const gastronomicCulture: GastronomicCultureEntity[] =
        await this.gastronomicCultureRepository.find({
          relations: ['countries', 'restaurants', 'recipes', 'products'],
        });
      await this.cacheManager.set(this.cacheKey, gastronomicCulture);
      return gastronomicCulture;
    }

    return cached;
  }

  async findOne(id: string): Promise<GastronomicCultureEntity> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
      relations: ['countries', 'restaurants', 'recipes', 'products'],
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return gastronomicCulture;
  }

  async create(
    gastronomicCulture: GastronomicCultureEntity,
  ): Promise<GastronomicCultureEntity> {
    return await this.gastronomicCultureRepository.save(gastronomicCulture);
  }

  async update(
    id: string,
    gastronomicCulture: GastronomicCultureEntity,
  ): Promise<GastronomicCultureEntity> {
    const persistedGastronomicCulture =
      await this.gastronomicCultureRepository.findOne({ where: { id } });
    if (!persistedGastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.gastronomicCultureRepository.save({
      ...persistedGastronomicCulture,
      ...gastronomicCulture,
    });
  }

  async delete(id: string): Promise<void> {
    const gastronomicCulture = await this.gastronomicCultureRepository.findOne({
      where: { id },
    });
    if (!gastronomicCulture) {
      throw new BusinessLogicException(
        'The gastronomic culture with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.gastronomicCultureRepository.remove(gastronomicCulture);
  }
}
