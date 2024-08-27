import { Module } from '@nestjs/common';
import { GastronomicCultureCountryService } from './gastronomic-culture-country.service';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';

@Module({
  imports: [GastronomicCultureService],
  providers: [GastronomicCultureCountryService],
})
export class GastronomicCultureCountriesModule {}
