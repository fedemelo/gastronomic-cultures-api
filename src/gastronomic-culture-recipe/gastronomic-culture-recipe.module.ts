/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from '../recipe/recipe.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RecipeService } from '../recipe/recipe.service';
import { GastronomicCultureRecipeController } from './gastronomic-culture-recipe.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, RecipeEntity]),
    CacheModule.register(),
  ],
  providers: [
    GastronomicCultureRecipeService,
    GastronomicCultureService,
    RecipeService,
  ],
  controllers: [GastronomicCultureRecipeController],
})
export class GastronomicCultureRecipeModule {}
