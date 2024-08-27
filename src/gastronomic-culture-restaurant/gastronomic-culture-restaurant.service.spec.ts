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

describe('GastronomicCultureRestaurantService', () => {
  let service: GastronomicCultureRestaurantService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let restaurantRepository: Repository<RestaurantEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let restaurantsList: RestaurantEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
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

    await seedDatabase();
  });

  const seedDatabase = async () => {
    restaurantRepository.clear();
    gastronomicCultureRepository.clear();

    restaurantsList = [];
    for (let i = 0; i < 5; i++) {
      const restaurant: RestaurantEntity = await restaurantRepository.save({
        // TODO: Complete with country fields @fedemelo
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
      // TODO: Complete with country fields @fedemelo
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
    // TODO: Complete with country fields @fedemelo
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
      // TODO: Complete with country fields @fedemelo
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
    // TODO: Complete with country fields @fedemelo
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
      // TODO: Complete with country fields @fedemelo
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
      // TODO: Complete with country fields @fedemelo
    });

    const updatedGastronomicCulture: GastronomicCultureEntity =
      await service.associateRestaurantsToGastronomicCulture(
        gastronomicCulture.id,
        [newRestaurant],
      );
    expect(updatedGastronomicCulture.restaurants.length).toBe(1);
    // TODO: Complete with country fields @fedemelo
  });

  it('associateRestaurantsToGastronomicCulture should throw an exception for an invalid gastronomic culture', async () => {
    const newRestaurant: RestaurantEntity = await restaurantRepository.save({
      // TODO: Complete with country fields @fedemelo
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
      // TODO: Complete with country fields @fedemelo
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
