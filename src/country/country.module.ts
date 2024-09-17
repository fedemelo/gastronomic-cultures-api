import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([CountryEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
