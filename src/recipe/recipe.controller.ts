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
  UseInterceptors,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { plainToInstance } from 'class-transformer';
import { RecipeDto } from './recipe.dto';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('recipes')
export class RecipeController {
  constructor(
    private readonly recipeService: RecipeService,
  ) {}

  @Get()
  async findAll() {
    return await this.recipeService.findAll();
  }
  
  @Get(':recipeId')
  async findOne(@Param('recipeId') recipeId: string) {
    return await this.recipeService.findOne(recipeId);
  }

  @Post()
  async create(@Body() recipeDto: RecipeDto) {
    const recipe = plainToInstance(
      RecipeEntity,
      recipeDto,
    );
    return await this.recipeService.create(recipe);
  }

  @Put(':recipeId')
  async update(
    @Param('recipeId') recipeId: string,
    @Body() recipeDto: RecipeDto,
  ) {
    const recipe = plainToInstance(
      RecipeEntity,
      recipeDto,
    );
    return await this.recipeService.update(
      recipeId,
      recipe,
    );
  }

  @Delete(':recipeId')
  @HttpCode(204)
  async delete(@Param('recipeId') recipeId: string) {
    return await this.recipeService.delete(recipeId);
  }
}
