import { Module } from '@nestjs/common';
import { GastronomicCultureCountriesService } from './gastronomic-culture-countries.service';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';

@Module({
  imports: [GastronomicCultureService],
  providers: [GastronomicCultureCountriesService],
})
export class GastronomicCultureCountriesModule {}
