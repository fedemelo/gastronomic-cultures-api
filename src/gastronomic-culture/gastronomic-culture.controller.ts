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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { GastronomicCultureDto } from './gastronomic-culture.dto';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class GastronomicCultureController {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findAll() {
    return await this.gastronomicCultureService.findAll();
  }

  @Get(':cultureId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findOne(@Param('cultureId') cultureId: string) {
    return await this.gastronomicCultureService.findOne(cultureId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
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
