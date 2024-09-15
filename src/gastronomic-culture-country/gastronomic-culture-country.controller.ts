import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { GastronomicCultureCountryService } from './gastronomic-culture-country.service';
import { CountryDto } from '../country/country.dto';
import { plainToInstance } from 'class-transformer';
import { CountryEntity } from 'src/country/country.entity';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class GastronomicCultureCountryController {
  constructor(
    private readonly gastronomicCultureCountryService: GastronomicCultureCountryService,
  ) {}

  @Post(':cultureId/countries/:countryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async addCountryToGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.addCountryToGastronomicCulture(
      cultureId,
      countryId,
    );
  }

  @Get(':cultureId/countries/:countryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findCountryByGastronomicCultureIdAndCountryId(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountryByGastronomicCultureIdAndCountryId(
      cultureId,
      countryId,
    );
  }

  @Get(':cultureId/countries')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findCountriesByGastronomicCultureId(
    @Param('cultureId') cultureId: string,
  ) {
    return await this.gastronomicCultureCountryService.findCountriesByGastronomicCultureId(
      cultureId,
    );
  }

  @Put(':cultureId/countries')
  async associateCountriesToGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Body() countriesDto: CountryDto[],
  ) {
    const countries = plainToInstance(CountryEntity, countriesDto);
    return await this.gastronomicCultureCountryService.associateCountriesToGastronomicCulture(
      cultureId,
      countries,
    );
  }

  @Delete(':cultureId/countries/:countryId')
  @HttpCode(204)
  async deleteCountryFromGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Param('countryId') countryId: string,
  ) {
    return await this.gastronomicCultureCountryService.deleteCountryFromGastronomicCulture(
      cultureId,
      countryId,
    );
  }
}
