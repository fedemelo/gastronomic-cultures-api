import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestaurantEntity } from './restaurant.entity';
import { RestaurantService } from './restaurant.service';
import { faker } from '@faker-js/faker';
import { CountryEntity } from 'src/country/country.entity';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;
  let restaurantsList: RestaurantEntity[];
  let country: CountryEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repository = module.get<Repository<RestaurantEntity>>(
      getRepositoryToken(RestaurantEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await repository.save({
        name: faker.word.words(),
        city: faker.location.city(),
        michelinStars: faker.number.int({ min: 0, max: 3 }),
        awardDate: faker.date.past(),
        country: country,
        gastronomicCultures: [],
      });
      restaurantsList.push(restaurant);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all restaurants', async () => {
    const restaurants: RestaurantEntity[] = await service.findAll();
    expect(restaurants).not.toBeNull();
    expect(restaurants).toHaveLength(restaurantsList.length);
  });

  it('findOne should return a restaurant by id', async () => {
    const storedRestaurant: RestaurantEntity = restaurantsList[0];
    const restaurant: RestaurantEntity = await service.findOne(
      storedRestaurant.id,
    );
    expect(restaurant).not.toBeNull();
    expect(restaurant.name).toEqual(storedRestaurant.name);
  });

  it('findOne should throw an exception for an invalid restaurant', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('create should return a new restaurant', async () => {
    const restaurant: RestaurantEntity = {
      id: '',
      name: faker.word.words(),
      city: faker.location.city(),
      michelinStars: faker.number.int({ min: 0, max: 3 }),
      awardDate: faker.date.past(),
      country: country,
      gastronomicCultures: [],
    };

    const newRestaurant: RestaurantEntity = await service.create(restaurant);
    expect(newRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: newRestaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(newRestaurant.name);
  });

  it('update should modify a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    restaurant.name = 'New name';

    const updatedRestaurant: RestaurantEntity = await service.update(
      restaurant.id,
      restaurant,
    );
    expect(updatedRestaurant).not.toBeNull();

    const storedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(storedRestaurant).not.toBeNull();
    expect(storedRestaurant.name).toEqual(restaurant.name);
  });

  it('update should throw an exception for an invalid restaurant', async () => {
    let restaurant: RestaurantEntity = restaurantsList[0];
    restaurant = {
      ...restaurant,
      name: 'New name',
    };
    await expect(() => service.update('0', restaurant)).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });

  it('delete should remove a restaurant', async () => {
    const restaurant: RestaurantEntity = restaurantsList[0];
    await service.delete(restaurant.id);

    const deletedRestaurant: RestaurantEntity = await repository.findOne({
      where: { id: restaurant.id },
    });
    expect(deletedRestaurant).toBeNull();
  });

  it('delete should throw an exception for an invalid restaurant', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The restaurant with the given id was not found',
    );
  });
});
