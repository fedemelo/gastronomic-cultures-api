import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureRestaurantService } from './gastronomic-culture-restaurant.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { RestaurantEntity } from '../restaurant/restaurant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CountryEntity } from '../country/country.entity';
import { CacheModule } from '@nestjs/cache-manager';

describe('GastronomicCultureRestaurantService', () => {
  let service: GastronomicCultureRestaurantService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let countryRepository: Repository<CountryEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let restaurantsList: RestaurantEntity[];
  let country: CountryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [
        GastronomicCultureRestaurantService,
        GastronomicCultureService,
        RestaurantService,
      ],
    }).compile();

    service = module.get<GastronomicCultureRestaurantService>(
      GastronomicCultureRestaurantService,
    );
    gastronomicCultureRepository = module.get<
      Repository<GastronomicCultureEntity>
    >(getRepositoryToken(GastronomicCultureEntity));
    restaurantRepository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    countryRepository = module.get<Repository<CountryEntity>>(
      getRepositoryToken(CountryEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    gastronomicCultureRepository.clear();
    countryRepository.clear();

    country = await countryRepository.save({
      name: faker.location.country(),
    });

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        name: faker.company.name(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 0, max: 3 }),
        awardDate: faker.date.past(),
        country: country,
        gastronomicCultures: [],
      });
      restaurantsList.push(restaurant);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      restaurants: restaurantsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestaurantToGastronomicCulture should add a restaurant to a gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      gastronomicCultures: [],
    });

    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    const result: GastronomicCultureEntity =
      await service.addRestaurantToGastronomicCulture(
        newGastronomicCulture.id,
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

  it('addRestaurantToGastronomicCulture should throw an exception for an invalid restaurant', async () => {
    const newGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
      });

    await expect(() =>
      service.addRestaurantToGastronomicCulture(newGastronomicCulture.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('addRestaurantToGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    });

    await expect(() =>
      service.addRestaurantToGastronomicCulture('0', newRestaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRestaurantByGastronomicCultureIdAndRestaurantId should return restaurant by gastronomic culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    const storedRestaurant: RestaurantEntity =
      await service.findRestaurantByGastronomicCultureIdAndRestaurantId(
        gastronomicCulture.id,
        restaurant.id,
      );
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toBe(restaurant.name);
    expect(storedRestaurant.city).toBe(restaurant.city);
    expect(storedRestaurant.michelinStars).toBe(restaurant.michelinStars);
    expect(storedRestaurant.awardDate).toEqual(restaurant.awardDate);
  });

  it('findRestaurantByGastronomicCultureIdAndRestaurantId should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.findRestaurantByGastronomicCultureIdAndRestaurantId(
        gastronomicCulture.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('findRestaurantByGastronomicCultureIdAndRestaurantId should throw an exception for an invalid gastronomic culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() =>
      service.findRestaurantByGastronomicCultureIdAndRestaurantId(
        '0',
        restaurant.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('findRestaurantByGastronomicCultureIdAndRestaurantId should throw an exception for a restaurant not associated with the gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    });

    await expect(() =>
      service.findRestaurantByGastronomicCultureIdAndRestaurantId(
        gastronomicCulture.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the gastronomic culture',
    );
  });

  it('findRestaurantsByGastronomicCultureId should return restaurants by gastronomic culture', async () => {
    const restaurants: RestaurantEntity[] =
      await service.findRestaurantsByGastronomicCultureId(
        gastronomicCulture.id,
      );
    expect(restaurants.length).toBe(5);
  });

  it('findRestaurantsByGastronomicCultureId should throw an exception for an invalid gastronomic culture', async () => {
    await expect(() =>
      service.findRestaurantsByGastronomicCultureId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateRestaurantsToGastronomicCulture should update restaurants list for a gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateRestaurantsToGastronomicCulture(
        gastronomicCulture.id,
        [newRestaurant],
      );
    expect(updatedGastronomicCulture.restaurants.length).toBe(1);
    expect(updatedGastronomicCulture.restaurants[0].name).toBe(
      newRestaurant.name,
    );
    expect(updatedGastronomicCulture.restaurants[0].city).toBe(
      newRestaurant.city,
    );
    expect(updatedGastronomicCulture.restaurants[0].michelinStars).toBe(
      newRestaurant.michelinStars,
    );
    expect(updatedGastronomicCulture.restaurants[0].awardDate).toEqual(
      newRestaurant.awardDate,
    );
  });

  it('associateRestaurantsToGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    });

    await expect(() =>
      service.associateRestaurantsToGastronomicCulture('0', [newRestaurant]),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('associateRestaurantsToGastronomicCulture should throw an exception for an invalid restaurant', async () => {
    const newRestaurant: RestaurantEntity = restaurantsList[0];
    newRestaurant.id = '0';

    await expect(() =>
      service.associateRestaurantsToGastronomicCulture(gastronomicCulture.id, [
        newRestaurant,
      ]),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantFromGastronomicCulture should remove a restaurant from a gastronomic culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];

    await service.deleteRestaurantFromGastronomicCulture(
      gastronomicCulture.id,
      restaurant.id,
    );

    const storedGastronomicCulture: GastronomicCultureEntity =
      await gastronomicCultureRepository.findOne({
        where: { id: gastronomicCulture.id },
        relations: ['restaurants'],
      });
    const deletedRestaurant: RestaurantEntity =
      storedGastronomicCulture.restaurants.find((a) => a.id === restaurant.id);

    expect(deletedRestaurant).toBeUndefined();
  });

  it('deleteRestaurantFromGastronomicCulture should throw an exception for an invalid restaurant', async () => {
    await expect(() =>
      service.deleteRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        '0',
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('deleteRestaurantFromGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await expect(() =>
      service.deleteRestaurantFromGastronomicCulture('0', restaurant.id),
    ).rejects.toHaveProperty(
      'message',
      'The gastronomic culture with the given id was not found',
    );
  });

  it('deleteRestaurantFromGastronomicCulture should throw an exception for a non-associated restaurant', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      name: faker.company.name(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    });

    await expect(() =>
      service.deleteRestaurantFromGastronomicCulture(
        gastronomicCulture.id,
        newRestaurant.id,
      ),
    ).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id is not associated to the gastronomic culture',
    );
  });
});
