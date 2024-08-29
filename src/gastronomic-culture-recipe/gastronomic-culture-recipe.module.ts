/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GastronomicCultureEntity, RecipeEntity])],
  providers: [GastronomicCultureRecipeService]
})
export class GastronomicCultureRecipeModule {}
