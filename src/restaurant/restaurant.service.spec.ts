import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { RestaurantEntity } from './restaurant.entity';
import { Repository } from 'typeorm';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repository: Repository<RestaurantEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestaurantService],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
