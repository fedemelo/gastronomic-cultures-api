import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from './product.service';
import { ProductEntity } from './product.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('ProductService', () => {
  let service: ProductService;
  let repository: Repository<ProductEntity>;
  let productsList: ProductEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await repository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
        category: faker.lorem.word(),
        gastronomicCulture: null,
      });
      productsList.push(product);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined(); 
  });

  it('findAll should return all products', async () => {
    const products: ProductEntity[] = await service.findAll();
    expect(products).not.toBeNull();
    expect(products).toHaveLength(productsList.length);
  });

  it('findOne should return a product by id', async () => {
    const storedProduct: ProductEntity = productsList[0];
    const product: ProductEntity = await service.findOne(storedProduct.id);
    expect(product).not.toBeNull();
    expect(product.id).toEqual(storedProduct.id);
    expect(product.name).toEqual(storedProduct.name);
    expect(product.description).toEqual(storedProduct.description);
    expect(product.history).toEqual(storedProduct.history);
    expect(product.category).toEqual(storedProduct.category);
  });

  it('findOne should throw an exception for an invaid product', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The product with the given id was not found")
  });

  it('create should return a product', async () => {
    const product: ProductEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
      gastronomicCulture: null,
    };

    const newProduct: ProductEntity = await service.create(product);
    expect(newProduct).not.toBeNull();

    const storedProduct: ProductEntity = await service.findOne(newProduct.id);
    expect(storedProduct).not.toBeNull();
    expect(storedProduct.id).toEqual(newProduct.id);
    expect(storedProduct.name).toEqual(newProduct.name);
    expect(storedProduct.description).toEqual(newProduct.description);
    expect(storedProduct.history).toEqual(newProduct.history);
    expect(storedProduct.category).toEqual(newProduct.category);
  });

  it('update should modify a product', async () => {
    const product: ProductEntity = productsList[0];
    product.name = faker.company.name();
    product.description = faker.lorem.sentence();

    const updatedProduct: ProductEntity = await service.update(product.id, product);
    expect(updatedProduct).not.toBeNull();

    const storedProduct: ProductEntity = await service.findOne(product.id);
    expect(storedProduct).not.toBeNull();

    expect(storedProduct.id).toEqual(product.id);
    expect(storedProduct.name).toEqual(product.name);
    expect(storedProduct.description).toEqual(product.description);
  });

  it('update should throw an exception for an invalid product', async () => {
    let product: ProductEntity = productsList[0];
    product = {
      ...product,
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    };
    await expect(() => service.update("0", product)).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

  it('delete should remove a product', async () => {
    const product: ProductEntity = productsList[0];
    await service.delete(product.id);
    const deletedProduct: ProductEntity = await repository.findOne({ where: { id: product.id } });
    expect(deletedProduct).toBeNull();
  });

  it('delete should throw an exception for an invalid product', async () => {
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The product with the given id was not found");
  });

});