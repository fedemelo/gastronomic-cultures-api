/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class GastronomicCultureService {
  constructor(
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
  ) {}

  async findAll(): Promise<GastronomicCultureEntity[]> {
    return await this.gastronomicCultureRepository.find({
      relations: ['countries', 'restaurants', 'recipes', 'products'],
    });
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
