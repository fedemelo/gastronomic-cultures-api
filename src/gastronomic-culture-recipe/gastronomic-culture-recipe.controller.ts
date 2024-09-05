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
    UseInterceptors,
  } from '@nestjs/common';
  import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
  import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
  import { RecipeDto } from '../recipe/recipe.dto';
  import { plainToInstance } from 'class-transformer';
  import { RecipeEntity } from 'src/recipe/recipe.entity';
  
  @UseInterceptors(BusinessErrorsInterceptor)
  @Controller('cultures')
  export class GastronomicCultureRecipeController {
    constructor(
      private readonly gastronomicCultureRecipeService: GastronomicCultureRecipeService,
    ) {}
  
    @Post(':cultureId/recipes/:recipeId')
    async addRecipeToGastronomicCulture(
      @Param('cultureId') cultureId: string,
      @Param('recipeId') recipeId: string,
    ) {
      return await this.gastronomicCultureRecipeService.addRecipeToGastronomicCulture(
        cultureId,
        recipeId,
      );
    }
  
    @Get(':cultureId/recipes/:recipeId')
    async findRecipeByGastronomicCultureIdAndRecipeId(
      @Param('cultureId') cultureId: string,
      @Param('recipeId') recipeId: string,
    ) {
      return await this.gastronomicCultureRecipeService.findRecipeByGastronomicCultureIdAndRecipeId(
        cultureId,
        recipeId,
      );
    }
  
    @Get(':cultureId/recipes')
    async findRecipesByGastronomicCultureId(
      @Param('cultureId') cultureId: string,
    ) {
      return await this.gastronomicCultureRecipeService.findRecipesByGastronomicCultureId(
        cultureId,
      );
    }
  
    @Put(':cultureId/recipes')
    async associateRecipesToGastronomicCulture(
      @Param('cultureId') cultureId: string,
      @Body() recipesDto: RecipeDto[],
    ) {
      const recipes = plainToInstance(RecipeEntity, recipesDto);
      return await this.gastronomicCultureRecipeService.associateRecipesToGastronomicCulture(
        cultureId,
        recipes,
      );
    }
  
    @Delete(':cultureId/recipes/:recipeId')
    @HttpCode(204)
    async deleteRecipeFromGastronomicCulture(
      @Param('cultureId') cultureId: string,
      @Param('recipeId') recipeId: string,
    ) {
      return await this.gastronomicCultureRecipeService.deleteRecipeFromGastronomicCulture(
        cultureId,
        recipeId,
      );
    }
  }
  