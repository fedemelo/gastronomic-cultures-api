import { plainToInstance } from 'class-transformer';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { RestaurantDto } from '../restaurant/restaurant.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class GastronomicCultureRestaurantController {
  constructor(
    private readonly gastronomicCultureRestaurantService: GastronomicCultureRestaurantService,
  ) {}

  @Get(':cultureId/restaurants')
  async findRestaurantsByGastronomicCultureId(
    @Param('cultureId') cultureId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantsByGastronomicCultureId(
      cultureId,
    );
  }

  @Get(':cultureId/restaurants/:restaurantId')
  async findRestaurantByGastronomicCultureIdAndRestaurantId(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.findRestaurantByGastronomicCultureIdAndRestaurantId(
      cultureId,
      restaurantId,
    );
  }

  @Post(':cultureId/restaurants/:restaurantId')
  async addRestaurantToGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.addRestaurantToGastronomicCulture(
      cultureId,
      restaurantId,
    );
  }

  @Put(':cultureId/restaurants')
  async associateRestaurantsToGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Body() restaurantDto: RestaurantDto[],
  ) {
    const restaurants = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.gastronomicCultureRestaurantService.associateRestaurantsToGastronomicCulture(
      cultureId,
      restaurants,
    );
  }

  @Delete(':cultureId/restaurants/:restaurantId')
  @HttpCode(204)
  async deleteRestaurantFromGastronomicCulture(
    @Param('cultureId') cultureId: string,
    @Param('restaurantId') restaurantId: string,
  ) {
    return await this.gastronomicCultureRestaurantService.deleteRestaurantFromGastronomicCulture(
      cultureId,
      restaurantId,
    );
  }
}
