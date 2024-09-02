/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RecipeService } from '../recipe/recipe.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';

@Injectable()
export class GastronomicCultureRecipeService {
  constructor(
    private readonly gastronomicCultureService: GastronomicCultureService,
    private readonly recipeService: RecipeService,
  ) {}

  async addRecipeToGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ): Promise<GastronomicCultureEntity> {
    const recipe = await this.recipeService.findOne(recipeId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    gastronomicCulture.recipes = [...gastronomicCulture.recipes, recipe];
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
  async findRecipeByGastronomicCultureIdAndRecipeId(
    gastronomicCultureId: string,
    recipeId: string,
  ): Promise<RecipeEntity> {
    const recipe: RecipeEntity = await this.recipeService.findOne(recipeId);
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const recipeFound = gastronomicCulture.recipes.find(
      (recipeEntity: RecipeEntity) => recipeEntity.id === recipe.id,
    );
    if (!recipeFound) {
      throw new BusinessLogicException(
        'The recipe with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return recipe;
  }
  async findRecipesByGastronomicCultureId(
    gastronomicCultureId: string,
  ): Promise<RecipeEntity[]> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    return gastronomicCulture.recipes;
  }
  async associateRecipesToGastronomicCulture(
    gastronomicCultureId: string,
    recipes: RecipeEntity[],
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCulture: GastronomicCultureEntity =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    for (const recipe of recipes) {
      await this.recipeService.findOne(recipe.id);
    }
    gastronomicCulture.recipes = recipes;
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
  async deleteRecipeFromGastronomicCulture(
    gastronomicCultureId: string,
    recipeId: string,
  ): Promise<void> {
    const recipe = await this.recipeService.findOne(recipeId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    const recipeFound = gastronomicCulture.recipes.find(
      (recipeEntity: RecipeEntity) => recipeEntity.id === recipe.id,
    );
    if (!recipeFound) {
      throw new BusinessLogicException(
        'The recipe with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    gastronomicCulture.recipes = gastronomicCulture.recipes.filter(
      (recipeEntity: RecipeEntity) => recipeEntity.id !== recipe.id,
    );
    await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
}
