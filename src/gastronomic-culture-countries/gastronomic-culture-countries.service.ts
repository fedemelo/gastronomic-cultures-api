import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { CountryService } from '../country/country.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GastronomicCultureCountriesService {
  constructor(
    @InjectRepository(CountryEntity)
    private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    private readonly gastronomicCultureService: GastronomicCultureService,
    private readonly countryService: CountryService,
  ) {}

  async addCountryToGastronomicCulture(
    gastronomicCultureId: string,
    countryId: string,
  ): Promise<GastronomicCultureEntity> {
    const country = await this.countryService.findOne(countryId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    gastronomicCulture.countries = [...gastronomicCulture.countries, country];
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
  async findCountryByGastronomicCultureIdAndCountryId(
    gastronomicCultureId: string,
    countryId: string,
  ): Promise<CountryEntity> {
    const country: CountryEntity = await this.countryService.findOne(countryId);
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const countryFound = gastronomicCulture.countries.find(
      (countryEntity: CountryEntity) => countryEntity.id === country.id,
    );
    if (!countryFound) {
      throw new BusinessLogicException(
        'The country with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return country;
  }
  async findCountriesByGastronomicCultureId(
    gastronomicCultureId: string,
  ): Promise<CountryEntity[]> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    return gastronomicCulture.countries;
  }
  async associateCountriesToGastronomicCulture(
    gastronomicCultureId: string,
    countries: CountryEntity[],
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    for (const country of countries) {
      await this.countryService.findOne(country.id);
    }
    gastronomicCulture.countries = countries;
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
  async deleteCountryFromGastronomicCulture(
    gastronomicCultureId: string,
    countryId: string,
  ): Promise<void> {
    const country = await this.countryService.findOne(countryId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const countryFound = gastronomicCulture.countries.find(
      (countryEntity: CountryEntity) => countryEntity.id === country.id,
    );
    if (!countryFound) {
      throw new BusinessLogicException(
        'The country with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gastronomicCulture.countries = gastronomicCulture.countries.filter(
      (countryEntity: CountryEntity) => countryEntity.id !== country.id,
    );
    await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
}
