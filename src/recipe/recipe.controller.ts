/* eslint-disable prettier/prettier */
import { RecipeEntity } from './recipe.entity';
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
import { RecipeService } from './recipe.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RecipeDto } from './recipe.dto';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll, Role.ReadRecipe)
  async findAll() {
    return await this.recipeService.findAll();
  }

  @Get(':recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll, Role.ReadRecipe)
  async findOne(@Param('recipeId') recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async create(@Body() recipeDto: RecipeDto) {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return await this.recipeService.create(recipe);
  }

  @Put(':recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
  async update(
    @Param('recipeId') recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return await this.recipeService.update(recipeId, recipe);
  }

  @Delete(':recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Delete)
  @HttpCode(204)
  async delete(@Param('recipeId') recipeId: string) {
    return await this.recipeService.delete(recipeId);
  }
}
