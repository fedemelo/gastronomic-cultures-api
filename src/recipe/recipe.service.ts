import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class RecipeService {
  cacheKey: string = 'recipes';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(RecipeEntity)
    private readonly recipeRepository: Repository<RecipeEntity>,
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const cached: RecipeEntity[] = await this.cacheManager.get<RecipeEntity[]>(
      this.cacheKey,
    );

    if (!cached) {
      const recipes: RecipeEntity[] = await this.recipeRepository.find({
        relations: ['gastronomicCulture'],
      });
      await this.cacheManager.set(this.cacheKey, recipes);
      return recipes;
    }

    return cached;
  }

  async findOne(id: string): Promise<RecipeEntity> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
      relations: ['gastronomicCulture'],
    });
    if (!recipe) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return recipe;
  }

  async create(recipe: RecipeEntity): Promise<RecipeEntity> {
    return await this.recipeRepository.save(recipe);
  }

  async update(id: string, recipe: RecipeEntity): Promise<RecipeEntity> {
    const persistedRecipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!persistedRecipe) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.recipeRepository.save({
      ...persistedRecipe,
      ...recipe,
    });
  }

  async delete(id: string): Promise<void> {
    const recipe = await this.recipeRepository.findOne({
      where: { id },
    });
    if (!recipe) {
      throw new BusinessLogicException(
        'The recipe with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.recipeRepository.remove(recipe);
  }
}
