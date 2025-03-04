import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureCountryService } from './gastronomic-culture-country.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { CountryEntity } from '../country/country.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { CountryService } from '../country/country.service';
import { CacheModule } from '@nestjs/cache-manager';
import { faker } from '@faker-js/faker';

describe('GastronomicCultureCountriesService', () => {
  let service: GastronomicCultureCountryService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let countryRepository: Repository<CountryEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let countriesList: CountryEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [
        GastronomicCultureCountryService,
        GastronomicCultureService,
        CountryService,
      ],
    }).compile();

    service = module.get<GastronomicCultureCountryService>(
      GastronomicCultureCountryService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    countryRepository.clear();
    gastronomicCultureRepository.clear();

    countriesList = [];
    for (let i = 0; i < 5; i++) {
      const country: CountryEntity = await countryRepository.save({
        name: faker.location.country(),
      });
      countriesList.push(country);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      countries: countriesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCountryGastronomicCulture should add a country to a gastronomic culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const result: GastronomicCultureEntity =
      await service.addCountryToGastronomicCulture(
        newGastronomicCulture.id,
        newCountry.id,
      );

    expect(result.countries.length).toBe(1);
    expect(result.countries[0]).not.toBeNull();
    expect(result.countries[0].name).toBe(newCountry.name);
    expect(result.countries[0].id).toBe(newCountry.id);
  });

  it('addCountryGastronomicCulture should throw an exception for an invalid country', async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addCountryToGastronomicCulture(newGastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('addCountryGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(() =>
      service.addCountryToGastronomicCulture('0', newCountry.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findCountryByGastronomicCultureIdCountryId should return country by gastronomic culture', async () => {
    const country: CountryEntity = countriesList[0];
    const storedCountry: CountryEntity =
      await service.findCountryByGastronomicCultureIdAndCountryId(
        gastronomicCulture.id,
        country.id,
      );
    expect(storedCountry).not.toBeNull();
    expect(storedCountry.name).toBe(country.name);
    expect(storedCountry.id).toBe(country.id);
  });

  it('findCountryByGastronomicCultureIdCountryId should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findCountryByGastronomicCultureIdAndCountryId(
        gastronomicCulture.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findCountryByGastronomicCultureIdCountryId should throw an exception for an invalid gastronomic culture', async () => {
    const country: CountryEntity = countriesList[0];
    await expect(() =>
      service.findCountryByGastronomicCultureIdAndCountryId('0', country.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findCountryByGastronomicCultureIdCountryId should throw an exception for a country not associated to the gastronomic culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(() =>
      service.findCountryByGastronomicCultureIdAndCountryId(
        gastronomicCulture.id,
        newCountry.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id is not associated to the gastronomic culture',
    );
  });

  it('findCountriesByGastronomicCultureId should return countries by gastronomic culture', async () => {
    const countries: CountryEntity[] =
      await service.findCountriesByGastronomicCultureId(gastronomicCulture.id);
    expect(countries.length).toBe(5);
  });

  it('findCountriesByGastronomicCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findCountriesByGastronomicCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateCountriesGastronomicCulture should update countries list for a gastronomic culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateCountriesToGastronomicCulture(
        gastronomicCulture.id,
        [newCountry],
      );
    expect(updatedGastronomicCulture.countries.length).toBe(1);
    expect(updatedGastronomicCulture.countries[0].name).toBe(newCountry.name);
    expect(updatedGastronomicCulture.countries[0].id).toBe(newCountry.id);
  });

  it('associateCountriesGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(() =>
      service.associateCountriesToGastronomicCulture('0', [newCountry]),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateCountriesGastronomicCulture should throw an exception for an invalid country', async () => {
    const newCountry: CountryEntity = countriesList[0];
    newCountry.id = '0';

    await expect(() =>
      service.associateCountriesToGastronomicCulture(gastronomicCulture.id, [
        newCountry,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deleteCountryFromGastronomicCulture should remove a country from a gastronomic culture', async () => {
    const country: CountryEntity = countriesList[0];

    await service.deleteCountryFromGastronomicCulture(
      gastronomicCulture.id,
      country.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ['countries'],
      });
    const deletedCountry: CountryEntity =
      storedGastronomicCulture.countries.find((a) => a.id === country.id);

    expect(deletedCountry).toBeUndefined();
  });

  it('deleteCountryGastronomicCulture should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.deleteCountryFromGastronomicCulture(gastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deleteCountryGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const country: CountryEntity = countriesList[0];
    await expect(() =>
      service.deleteCountryFromGastronomicCulture('0', country.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteCountryGastronomicCulture should throw an exception for a non-associated country', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
    });

    await expect(() =>
      service.deleteCountryFromGastronomicCulture(
        gastronomicCulture.id,
        newCountry.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id is not associated to the gastronomic culture',
    );
  });
});
