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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestaurantDto } from './restaurant.dto';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('restaurants')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findAll() {
    return await this.restaurantService.findAll();
  }

  @Get(':restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findOne(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.findOne(restaurantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async create(@Body() restaurantDto: RestaurantDto) {
    const restaurant = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.restaurantService.create(restaurant);
  }

  @Put(':restaurantId')
  async update(
    @Param('restaurantId') restaurantId: string,
    @Body() restaurantDto: RestaurantDto,
  ) {
    const restaurant = plainToInstance(RestaurantEntity, restaurantDto);
    return await this.restaurantService.update(restaurantId, restaurant);
  }

  @Delete(':restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Admin, Role.Delete) 
  @HttpCode(204)
  async delete(@Param('restaurantId') restaurantId: string) {
    return await this.restaurantService.delete(restaurantId);
  }
}
