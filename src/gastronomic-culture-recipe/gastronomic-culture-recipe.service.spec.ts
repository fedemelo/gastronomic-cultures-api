/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureRecipeService } from './gastronomic-culture-recipe.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RecipeEntity } from '../recipe/recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RecipeService } from '../recipe/recipe.service';

describe('GastronomicCultureRecipesService', () => {
  let service: GastronomicCultureRecipeService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let recipeRepository: Repository<RecipeEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let recipesList: RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        GastronomicCultureRecipeService,
        GastronomicCultureService,
        RecipeService,
      ],
    }).compile();

    service = module.get<GastronomicCultureRecipeService>(
      GastronomicCultureRecipeService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    recipeRepository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    recipeRepository.clear();
    gastronomicCultureRepository.clear();

    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity = await recipeRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        photo: faker.image.url(),
        preparationProcess: faker.lorem.sentence(),
        video: faker.image.url()
      });
      recipesList.push(recipe);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      recipes: recipesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRecipeGastronomicCulture should add a recipe to a gastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparationProcess: faker.lorem.sentence(),
      video: faker.image.url()
    });

    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const result: GastronomicCultureEntity =
      await service.addRecipeToGastronomicCulture(
        newGastronomicCulture.id,
        newRecipe.id,
      );

    expect(result.recipes.length).toBe(1);
    expect(result.recipes[0]).not.toBeNull();
    expect(result.recipes[0].id).toEqual(newRecipe.id);
    expect(result.recipes[0].name).toEqual(newRecipe.name);
    expect(result.recipes[0].description).toEqual(newRecipe.description);
    expect(result.recipes[0].photo).toEqual(newRecipe.photo);
    expect(result.recipes[0].preparationProcess).toEqual(newRecipe.preparationProcess);
    expect(result.recipes[0].video).toEqual(newRecipe.video);
  });

  it('addRecipeGastronomicCulture should throw an exception for an invalid recipe', async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addRecipeToGastronomicCulture(newGastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('addRecipeGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparationProcess: faker.lorem.sentence(),
      video: faker.image.url()
    });

    await expect(() =>
      service.addRecipeToGastronomicCulture('0', newRecipe.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureIdRecipeId should return recipe by gastronomic culture', async () => {
    const recipe: RecipeEntity = recipesList[0];
    const storedRecipe: RecipeEntity =
      await service.findRecipeByGastronomicCultureIdAndRecipeId(
        gastronomicCulture.id,
        recipe.id,
      );
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.id).toEqual(recipe.id);
    expect(storedRecipe.name).toEqual(recipe.name);
    expect(storedRecipe.description).toEqual(recipe.description);
    expect(storedRecipe.photo).toEqual(recipe.photo);
    expect(storedRecipe.preparationProcess).toEqual(recipe.preparationProcess);
    expect(storedRecipe.video).toEqual(recipe.video);
  });

  it('findRecipeByGastronomicCultureIdRecipeId should throw an exception for an invalid recipe', async () => {
    await expect(() =>
      service.findRecipeByGastronomicCultureIdAndRecipeId(
        gastronomicCulture.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureIdRecipeId should throw an exception for an invalid gastronomic culture', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await expect(() =>
      service.findRecipeByGastronomicCultureIdAndRecipeId('0', recipe.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRecipeByGastronomicCultureIdRecipeId should throw an exception for a recipe not associated to the gastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
       name: faker.company.name(),
       description: faker.lorem.sentence(),
       photo: faker.image.url(),
       preparationProcess: faker.lorem.sentence(),
       video: faker.image.url()
    });

    await expect(() =>
      service.findRecipeByGastronomicCultureIdAndRecipeId(
        gastronomicCulture.id,
        newRecipe.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id is not associated to the gastronomic culture',
    );
  });

  it('findRecipesByGastronomicCultureId should return recipes by gastronomic culture', async () => {
    const recipes: RecipeEntity[] =
      await service.findRecipesByGastronomicCultureId(gastronomicCulture.id);
    expect(recipes.length).toBe(5);
  });

  it('findRecipesByGastronomicCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findRecipesByGastronomicCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateRecipesGastronomicCulture should update recipes list for a gastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparationProcess: faker.lorem.sentence(),
      video: faker.image.url()
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateRecipesToGastronomicCulture(
        gastronomicCulture.id,
        [newRecipe],
      );
    expect(updatedGastronomicCulture.recipes.length).toBe(1);
    expect(updatedGastronomicCulture.recipes[0]).not.toBeNull();
    expect(updatedGastronomicCulture.recipes[0].id).toEqual(newRecipe.id);
    expect(updatedGastronomicCulture.recipes[0].name).toEqual(newRecipe.name);
    expect(updatedGastronomicCulture.recipes[0].description).toEqual(newRecipe.description);
    expect(updatedGastronomicCulture.recipes[0].photo).toEqual(newRecipe.photo);
    expect(updatedGastronomicCulture.recipes[0].preparationProcess).toEqual(newRecipe.preparationProcess);
    expect(updatedGastronomicCulture.recipes[0].video).toEqual(newRecipe.video);
  });

  it('associateRecipesGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparationProcess: faker.lorem.sentence(),
      video: faker.image.url()
    });

    await expect(() =>
      service.associateRecipesToGastronomicCulture('0', [newRecipe]),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateRecipesGastronomicCulture should throw an exception for an invalid recipe', async () => {
    const newRecipe: RecipeEntity = recipesList[0];
    newRecipe.id = '0';

    await expect(() =>
      service.associateRecipesToGastronomicCulture(gastronomicCulture.id, [
        newRecipe,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('deleteRecipeGastronomicCulture should remove a recipe from a gastronomic culture', async () => {
    const recipe: RecipeEntity = recipesList[0];

    await service.deleteRecipeFromGastronomicCulture(
      gastronomicCulture.id,
      recipe.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ['recipes'],
      });
    const deletedRecipe: RecipeEntity =
      storedGastronomicCulture.recipes.find((a) => a.id === recipe.id);

    expect(deletedRecipe).toBeUndefined();
  });

  it('deleteRecipeGastronomicCulture should throw an exception for an invalid recipe', async () => {
    await expect(() =>
      service.deleteRecipeFromGastronomicCulture(gastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('deleteRecipeGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const recipe: RecipeEntity = recipesList[0];
    await expect(() =>
      service.deleteRecipeFromGastronomicCulture('0', recipe.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteRecipeGastronomicCulture should throw an exception for a non-associated recipe', async () => {
    const newRecipe: RecipeEntity = await recipeRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        photo: faker.image.url(),
        preparationProcess: faker.lorem.sentence(),
        video: faker.image.url()
    });

    await expect(() =>
      service.deleteRecipeFromGastronomicCulture(
        gastronomicCulture.id,
        newRecipe.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id is not associated to the gastronomic culture',
    );
  });
});
