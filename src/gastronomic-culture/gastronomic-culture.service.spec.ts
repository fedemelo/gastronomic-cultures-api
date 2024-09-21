/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CacheModule } from '@nestjs/cache-manager';

describe('GastronomicCultureService', () => {
  let service: GastronomicCultureService;
  let repository: Repository<GastronomicCultureEntity>;
  let gastronomicCulturesList: GastronomicCultureEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [GastronomicCultureService],
    }).compile();

    service = module.get<GastronomicCultureService>(GastronomicCultureService);
    repository = module.get<Repository<GastronomicCultureEntity>>(
      getRepositoryToken(GastronomicCultureEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    gastronomicCulturesList = [];
    for (let i = 0; i < 5; i++) {
      const gastronomicCulture: GastronomicCultureEntity =
        await repository.save({
          name: faker.company.name(),
          description: faker.lorem.sentence(),
          countries: [],
          restaurants: [],
          recipes: [],
          products: [],
        });
      gastronomicCulturesList.push(gastronomicCulture);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all gastronomic cultures', async () => {
    const gastronomicCultures: GastronomicCultureEntity[] =
      await service.findAll();
    expect(gastronomicCultures).not.toBeNull();
    expect(gastronomicCultures).toHaveLength(gastronomicCulturesList.length);
  });

  it('findOne should return a gastronomic culture by id', async () => {
    const storedGastronomicCulture: GastronomicCultureEntity =
      gastronomicCulturesList[0];
    const gastronomicCulture: GastronomicCultureEntity = await service.findOne(
      storedGastronomicCulture.id,
    );
    expect(gastronomicCulture).not.toBeNull();
    expect(gastronomicCulture.name).toEqual(storedGastronomicCulture.name);
    expect(gastronomicCulture.description).toEqual(
      storedGastronomicCulture.description,
    );
  });

  it('findOne should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('create should return a new gastronomic culture', async () => {
    const gastronomicCulture: GastronomicCultureEntity = {
      id: '',
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      countries: [],
      restaurants: [],
      recipes: [],
      products: [],
    };

    const newGastronomicCulture: GastronomicCultureEntity =
      await service.create(gastronomicCulture);
    expect(newGastronomicCulture).not.toBeNull();

    const storedGastronomicCulture: GastronomicCultureEntity =
      await repository.findOne({
        where: { id: newGastronomicCulture.id },
      });
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toEqual(newGastronomicCulture.name);
    expect(storedGastronomicCulture.description).toEqual(
      newGastronomicCulture.description,
    );
  });

  it('update should modify a gastronomic culture', async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      gastronomicCulturesList[0];
    gastronomicCulture.name = 'New name';
    gastronomicCulture.description = 'New description';
    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.update(gastronomicCulture.id, gastronomicCulture);
    expect(updatedGastronomicCulture).not.toBeNull();
    const storedGastronomicCulture: GastronomicCultureEntity =
      await repository.findOne({
        where: { id: gastronomicCulture.id },
      });
    expect(storedGastronomicCulture).not.toBeNull();
    expect(storedGastronomicCulture.name).toEqual(gastronomicCulture.name);
    expect(storedGastronomicCulture.description).toEqual(
      gastronomicCulture.description,
    );
  });

  it('update should throw an exception for an invalid gastronomic culture', async () => {
    let gastronomicCulture: GastronomicCultureEntity =
      gastronomicCulturesList[0];
    gastronomicCulture = {
      ...gastronomicCulture,
      name: 'New name',
      description: 'New description',
    };
    await expect(() =>
      service.update('0', gastronomicCulture),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('delete should remove a gastronomic culture', async () => {
    const gastronomicCulture: GastronomicCultureEntity =
      gastronomicCulturesList[0];
    await service.delete(gastronomicCulture.id);
    const deletedGastronomicCulture: GastronomicCultureEntity =
      await repository.findOne({
        where: { id: gastronomicCulture.id },
      });
    expect(deletedGastronomicCulture).toBeNull();
  });

  it('delete should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });
});
