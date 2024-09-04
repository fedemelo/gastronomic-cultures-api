import { Module } from '@nestjs/common';
import { GastronomicCultureCountryService } from './gastronomic-culture-country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { CountryService } from '../country/country.service';
import { GastronomicCultureCountryController } from './gastronomic-culture-country.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, CountryEntity]),
  ],
  providers: [
    GastronomicCultureCountryService,
    GastronomicCultureService,
    CountryService,
  ],
  controllers: [GastronomicCultureCountryController],
})
export class GastronomicCultureCountriesModule {}
