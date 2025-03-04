/* eslint-disable prettier/prettier */
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecipeService } from './recipe.service';
import { RecipeEntity } from './recipe.entity';
import { plainToInstance } from 'class-transformer';
import { RecipeDto } from './recipe.dto';

@Resolver()
export class RecipeResolver {
  constructor(private recipeService: RecipeService) {}

  @Query(() => [RecipeEntity])
  recipes(): Promise<RecipeEntity[]> {
    return this.recipeService.findAll();
  }

  @Query(() => RecipeEntity)
  recipe(@Args('id') id: string): Promise<RecipeEntity> {
    const recipes = this.recipeService.findOne(id);
    return recipes;
  }

  @Mutation(() => RecipeEntity)
  createRecipe(
    @Args('recipe') recipeDto: RecipeDto,
  ): Promise<RecipeEntity> {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return this.recipeService.create(recipe);
  }

  @Mutation(() => RecipeEntity)
  updateRecipe(
    @Args('id') id: string,
    @Args('recipe') recipeDto: RecipeDto,
  ): Promise<RecipeEntity> {
    const recipe = plainToInstance(RecipeEntity, recipeDto);
    return this.recipeService.update(id, recipe);
  }

  @Mutation(() => String)
  deleteRecipe(@Args('id') id: string) {
    this.recipeService.delete(id);
    return id;
  }
}
