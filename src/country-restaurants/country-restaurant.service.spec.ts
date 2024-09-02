import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { Repository } from 'typeorm';
import { CountryEntity } from '../country/country.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CountryRestaurantService } from './country-restaurant.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CountryService } from '../country/country.service';
import { RestaurantService } from '../restaurant/restaurant.service';

describe('CountryRestaurantService', () => {
  let service: CountryRestaurantService;
  let countryRepository: Repository<CountryEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let country: CountryEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryRestaurantService, CountryService, RestaurantService],
    }).compile();

    service = module.get<CountryRestaurantService>(CountryRestaurantService);
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await restaurantRepository.clear();
    await countryRepository.clear();

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.word.words(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 0, max: 3 }),
        awardDate: faker.date.past(),
        gastronomicCultures: [],
      });
      restaurantsList.push(restaurant);
    }

    country = await countryRepository.save({
      name: faker.location.country(),
      restaurants: restaurantsList,
      gastronomicCultures: [],
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantCountry should add a restaurant to a country', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
      restaurants: [],
      gastronomicCultures: [],
    });

    const result: CountryEntity = await service.addRestaurantCountry(
      newCountry.id,
      newRestaurant.id,
    );

    expect(result.restaurants.length).toBe(1);
    expect(result.restaurants[0]).not.toBeNull();
    expect(result.restaurants[0].name).toBe(newRestaurant.name);
    expect(result.restaurants[0].city).toBe(newRestaurant.city);
    expect(result.restaurants[0].michelinStars).toBe(
      newRestaurant.michelinStars,
    );
    expect(result.restaurants[0].awardDate).toEqual(newRestaurant.awardDate);
  });

  it('addRestaurantCountry should throw an exception for an invalid restaurant', async () => {
    const newCountry: CountryEntity = await countryRepository.save({
      name: faker.location.country(),
      restaurants: [],
      gastronomicCultures: [],
    });

    await expect(() =>
      service.addRestaurantCountry(newCountry.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('addRestaurantCountry should throw an exception for an invalid country', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    await expect(() =>
      service.addRestaurantCountry('0', newRestaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findRestaurantByCountryIdRestaurantId should return restaurant by country', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity =
      await service.findRestaurantByCountryIdRestaurantId(
        country.id,
        restaurant.id,
      );
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
    expect(storedRestaurant.city).toBe(restaurant.city);
    expect(storedRestaurant.michelinStars).toBe(restaurant.michelinStars);
    expect(storedRestaurant.awardDate).toEqual(restaurant.awardDate);
  });

  it('findRestaurantByCountryIdRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findRestaurantByCountryIdRestaurantId(country.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('findRestaurantByCountryIdRestaurantId should throw an exception for an invalid country', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() =>
      service.findRestaurantByCountryIdRestaurantId('0', restaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('findRestaurantByCountryIdRestaurantId should throw an exception for a restaurant not associated with the country', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    await expect(() =>
      service.findRestaurantByCountryIdRestaurantId(
        country.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the country',
    );
  });

  it('findRestaurantsByCountryId should return restaurants by country', async () => {
    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsByCountryId(country.id);
    expect(restaurants.length).toBe(5);
  });

  it('findRestaurantsByCountryId should throw an exception for an invalid country', async () => {
    await expect(() =>
      service.findRestaurantsByCountryId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('associateRestaurantsCountry should update restaurants list for a country', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    const updatedCountry: CountryEntity =
      await service.associateRestaurantsCountry(country.id, [newRestaurant]);
    expect(updatedCountry.restaurants.length).toBe(1);

    expect(updatedCountry.restaurants[0].name).toBe(newRestaurant.name);
    expect(updatedCountry.restaurants[0].city).toBe(newRestaurant.city);
    expect(updatedCountry.restaurants[0].michelinStars).toBe(
      newRestaurant.michelinStars,
    );
    expect(updatedCountry.restaurants[0].awardDate).toEqual(
      newRestaurant.awardDate,
    );
  });

  it('associateRestaurantsCountry should throw an exception for an invalid country', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    await expect(() =>
      service.associateRestaurantsCountry('0', [newRestaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('associateRestaurantsCountry should throw an exception for an invalid restaurant', async () => {
    const invalidRestaurant: RestaurantEntity = restaurantsList[0];
    invalidRestaurant.id = '0';

    await expect(() =>
      service.associateRestaurantsCountry(country.id, [invalidRestaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantCountry should remove a restaurant from a country', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantCountry(country.id, restaurant.id);

    const storedCountry: CountryEntity = await countryRepository.findOne({
      where: { id: country.id },
      relations: ['restaurants'],
    });
    const deletedRestaurant: RestaurantEntity = storedCountry.restaurants.find(
      (a) => a.id === restaurant.id,
    );

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantCountry should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.deleteRestaurantCountry(country.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantCountry should throw an exception for an invalid country', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() =>
      service.deleteRestaurantCountry('0', restaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The country with the given id was not found',
    );
  });

  it('deleteRestaurantCountry should throw an exception for a non-associated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    await expect(() =>
      service.deleteRestaurantCountry(country.id, newRestaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the country',
    );
  });
});
