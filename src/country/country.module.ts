import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryService],
})
export class CountryModule {}
