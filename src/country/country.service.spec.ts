import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { CountryEntity } from './country.entity';

describe('CountryService', () => {
  let service: CountryService;
  let repository: Repository<CountryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CountryService],
    }).compile();

    service = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
