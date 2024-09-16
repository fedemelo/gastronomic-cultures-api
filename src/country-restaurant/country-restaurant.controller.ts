/* eslint-disable prettier/prettier */
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
import { plainToInstance } from 'class-transformer';
import { RestaurantEntity } from 'src/restaurant/restaurant.entity';
import { RestaurantDto } from '../restaurant/restaurant.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CountryRestaurantService } from './country-restaurant.service';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('countries')
@UseInterceptors(BusinessErrorsInterceptor)
export class CountryRestaurantController {
  constructor(
    private readonly countryRestaurantService: CountryRestaurantService,
  ) {}

  @Post(':countryId/restaurants/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async addRestaurantCountry(
    @Param('countryId') countryId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.countryRestaurantService.addRestaurantCountry(
      countryId,
      restaurantId,
    );
  }

  @Get(':countryId/restaurants/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findRestaurantByCountryIdRestaurantId(
    @Param('countryId') countryId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.countryRestaurantService.findRestaurantByCountryIdRestaurantId(
      countryId,
      restaurantId,
    );
  }

  @Get(':countryId/restaurants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findRestaurantsByCountryId(@Param('countryId') countryId: string) {
    return await this.countryRestaurantService.findRestaurantsByCountryId(
      countryId,
    );
  }

  @Put(':countryId/restaurants')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async associateRestaurantsCountry(
    @Body() restaurantsDto: RestaurantDto[],
    @Param('countryId') countryId: string,
  ) {
    const restaurants = plainToInstance(RestaurantEntity, restaurantsDto);
    return await this.countryRestaurantService.associateRestaurantsCountry(
      countryId,
      restaurants,
    );
  }

  @Delete(':countryId/restaurants/:restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Delete)
  @HttpCode(204)
  async deleteRestaurantCountry(
    @Param('countryId') countryId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.countryRestaurantService.deleteRestaurantCountry(
      countryId,
      restaurantId,
    );
  }
}
