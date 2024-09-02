import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryEntity } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryController } from './country.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CountryEntity])],
  providers: [CountryService],
  controllers: [CountryController],
})
export class CountryModule {}
