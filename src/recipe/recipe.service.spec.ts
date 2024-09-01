/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { RecipeService } from './recipe.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RecipeEntity } from './recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RecipeService', () => {
  let service: RecipeService;
  let repository: Repository<RecipeEntity>;
  let recipesList: RecipeEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecipeService],
    }).compile();

    service = module.get<RecipeService>(RecipeService);
    repository = module.get<Repository<RecipeEntity>>(
      getRepositoryToken(RecipeEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    recipesList = [];
    for (let i = 0; i < 5; i++) {
      const recipe: RecipeEntity =
        await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          photo: faker.image.url(),
          preparationProcess: faker.lorem.sentence(),
          video: faker.image.url(),
          gastronomicCulture: null
        });
      recipesList.push(recipe);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all recipes', async () => {
    const recipes: RecipeEntity[] =
      await service.findAll();
    expect(recipes).not.toBeNull();
    expect(recipes).toHaveLength(recipesList.length);
  });

  it('findOne should return a recipe by id', async () => {
    const storedRecipe: RecipeEntity =
      recipesList[0];
    const recipe: RecipeEntity = await service.findOne(
      storedRecipe.id,
    );
    expect(recipe).not.toBeNull();
    expect(recipe.name).toEqual(storedRecipe.name);
    expect(recipe.description).toEqual(storedRecipe.description);
    expect(recipe.photo).toEqual(storedRecipe.photo);
    expect(recipe.preparationProcess).toEqual(storedRecipe.preparationProcess);
    expect(recipe.video).toEqual(storedRecipe.video);
  });

  it('findOne should throw an exception for an invalid recipe', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('create should return a new recipe', async () => {
    const recipe: RecipeEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      photo: faker.image.url(),
      preparationProcess: faker.lorem.sentence(),
      video: faker.image.url(),
      gastronomicCulture: null
    };

    const newRecipe: RecipeEntity =
      await service.create(recipe);
    expect(newRecipe).not.toBeNull();

    const storedRecipe: RecipeEntity =
      await repository.findOne({
        where: { id: newRecipe.id },
      });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(newRecipe.name);
    expect(storedRecipe.description).toEqual(
      newRecipe.description,
    );
  });

  it('update should modify a recipe', async () => {
    const recipe: RecipeEntity =
      recipesList[0];
    recipe.name = 'New name';
    recipe.description = 'New description';
    recipe.photo = 'newphoto.url';
    recipe.preparationProcess = 'New preparation process';
    recipe.video = 'newvideo.url';
    const updatedRecipe: RecipeEntity =
      await service.update(recipe.id, recipe);
    expect(updatedRecipe).not.toBeNull();
    const storedRecipe: RecipeEntity =
      await repository.findOne({
        where: { id: recipe.id },
      });
    expect(storedRecipe).not.toBeNull();
    expect(storedRecipe.name).toEqual(recipe.name);
    expect(storedRecipe.description).toEqual(recipe.description);
    expect(storedRecipe.photo).toEqual(recipe.photo);
    expect(storedRecipe.preparationProcess).toEqual(recipe.preparationProcess);
    expect(storedRecipe.video).toEqual(recipe.video);
  });

  it('update should throw an exception for an invalid recipe', async () => {
    let recipe: RecipeEntity =
      recipesList[0];
    recipe = {
      ...recipe,
      name: 'New name',
      description: 'New description',
      photo: 'newphoto.url',
      preparationProcess: 'New preparation process',
      video: 'newvideo.url',
    };
    await expect(() =>
      service.update('0', recipe),
    ).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });

  it('delete should remove a recipe', async () => {
    const recipe: RecipeEntity =
      recipesList[0];
    await service.delete(recipe.id);
    const deletedRecipe: RecipeEntity =
      await repository.findOne({
        where: { id: recipe.id },
      });
    expect(deletedRecipe).toBeNull();
  });

  it('delete should throw an exception for an invalid recipe', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The recipe with the given id was not found',
    );
  });
});
