import { Module } from '@nestjs/common';
import { GastronomicCultureCountryService } from './gastronomic-culture-country.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { CountryService } from '../country/country.service';
import { GastronomicCultureCountryController } from './gastronomic-culture-country.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [
    GastronomicCultureCountryService,
    GastronomicCultureService,
    CountryService,
  ],
  controllers: [GastronomicCultureCountryController],
})
export class GastronomicCultureCountriesModule {}
