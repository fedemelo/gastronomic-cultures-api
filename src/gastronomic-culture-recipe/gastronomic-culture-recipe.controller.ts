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
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { RecipeDto } from '../recipe/recipe.dto';
import { plainToInstance } from 'class-transformer';
import { RecipeEntity } from 'src/recipe/recipe.entity';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('cultures')
export class GastronomicCultureRecipeController {
  constructor(
    private readonly gastronomicCultureRecipeService: GastronomicCultureRecipeService,
  ) {}

  @Post(':cultureId/recipes/:recipeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
  async findRecipesByGastronomicCultureId(
    @Param('cultureId') cultureId: string,
  ) {
    return await this.gastronomicCultureRecipeService.findRecipesByGastronomicCultureId(
      cultureId,
    );
  }

  @Put(':cultureId/recipes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
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
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Admin, Role.Delete) 
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
