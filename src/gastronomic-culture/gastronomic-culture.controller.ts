import { GastronomicCultureEntity } from './gastronomic-culture.entity';
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
import { GastronomicCultureService } from './gastronomic-culture.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { GastronomicCultureDto } from './gastronomic-culture.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class GastronomicCultureController {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Get()
  async findAll() {
    return await this.gastronomicCultureService.findAll();
  }
  @Get(':cultureId')
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.gastronomicCultureService.findOne(cultureId);
  }

  @Post()
  async create(@Body() gastronomicCultureDto: GastronomicCultureDto) {
    const gastronomicCulture = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCultureDto,
    );
    return await this.gastronomicCultureService.create(gastronomicCulture);
  }
  @Put(':cultureId')
  async update(
    @Param('cultureId') cultureId: string,
    @Body() gastronomicCultureDto: GastronomicCultureDto,
  ) {
    const gastronomicCulture = plainToInstance(
      GastronomicCultureEntity,
      gastronomicCultureDto,
    );
    return await this.gastronomicCultureService.update(
      cultureId,
      gastronomicCulture,
    );
  }

  @Delete(':cultureId')
  @HttpCode(204)
  async delete(@Param('cultureId') cultureId: string) {
    return await this.gastronomicCultureService.delete(cultureId);
  }
}
