import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { GastronomicCultureProductService } from './gastronomic-culture-product.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { ProductEntity } from '../product/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { ProductService } from '../product/product.service';



describe('GastronomicCultureProductService', () => {
  let service: GastronomicCultureProductService;
  let gastronomicCultureRepository: Repository<GastronomicCultureEntity>;
  let productRepository: Repository<ProductEntity>;
  let gastronomicCulture: GastronomicCultureEntity;
  let productsList: ProductEntity[];


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        GastronomicCultureProductService,
        GastronomicCultureService,
        ProductService,
      ],
    }).compile();

    service = module.get<GastronomicCultureProductService>(GastronomicCultureProductService);
    gastronomicCultureRepository = module.get<Repository<GastronomicCultureEntity>>(getRepositoryToken(GastronomicCultureEntity));
    productRepository = module.get<Repository<ProductEntity>>(getRepositoryToken(ProductEntity));

    await seedDatabase();
  });

  async function seedDatabase() {
    productRepository.clear();
    gastronomicCultureRepository.clear();

    productsList = [];
    for (let i = 0; i < 5; i++) {
      const product: ProductEntity = await productRepository.save({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        history: faker.lorem.sentence(),
        category: faker.lorem.word(),
      });
      productsList.push(product);
    }

    gastronomicCulture = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      products: productsList,
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addProductGastronomicCulture should add a product to a gastronomic culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    const result: GastronomicCultureEntity = await service.addProductGastronomicCulture(newGastronomicCulture.id, newProduct.id); 

    expect(result.products.length).toBe(1);
    expect(result.products[0].id).toBe(newProduct.id);
    expect(result.products[0].name).toBe(newProduct.name);
    expect(result.products[0].description).toBe(newProduct.description);
    expect(result.products[0].history).toBe(newProduct.history);
    expect(result.products[0].category).toBe(newProduct.category);
  });

  it('addProductGastronomicCulture should throw an exeption for an invalid product id', async () => {
    const newGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
    });

    await expect(() => 
      service.addProductGastronomicCulture(newGastronomicCulture.id, '0')).rejects.toHaveProperty('message', 'The product with the given id does not exist');
  });

  it('addProductGastronomicCulture should throw an exeption for an invalid gastronomic culture id', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    await expect(() => 
      service.addProductGastronomicCulture('0', newProduct.id)).rejects.toHaveProperty('message', 'The gastronomic culture with the given id does not exist');
  });

  it('findProductsByGastronomicCultureIdAndProductId should return the products of a gastronomic culture', async () => {
    const product:ProductEntity = productsList[0];
    const storedProduct: ProductEntity = await service.findProductByGastronomicCultureIdAndProductId(gastronomicCulture.id, product.id);

    expect(storedProduct).not.toBeNull();
    expect(storedProduct.id).toBe(product.id);
    expect(storedProduct.name).toBe(product.name);
    expect(storedProduct.description).toBe(product.description);
    expect(storedProduct.history).toBe(product.history);
    expect(storedProduct.category).toBe(product.category);
  });

  it('findProductsByGastronomicCultureIdAndProductId should throw an exeption for an invalid product id', async () => {
    await expect(() => 
      service.findProductByGastronomicCultureIdAndProductId(gastronomicCulture.id, '0')).rejects.toHaveProperty('message', 'The product with the given id does not exist');
  });

  it('findProductsByGastronomicCultureIdAndProductId should throw an exeption for an invalid gastronomic culture id', async () => {
    const product:ProductEntity = productsList[0];
    await expect(() => 
      service.findProductByGastronomicCultureIdAndProductId('0', product.id)).rejects.toHaveProperty('message', 'The gastronomic culture with the given id does not exist');
  });

  it('findProductsByGastronomicCultureIdAndProductId should throw an exeption for a product not associated to the gastronomic culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    await expect(() => 
      service.findProductByGastronomicCultureIdAndProductId(gastronomicCulture.id, newProduct.id)).rejects.toHaveProperty('message', 'The product with the given id is not associated to the gastronomic culture');
  });

  it('findProductsByGastronomicCultureId should return the products of a gastronomic culture', async () => {
    const products: ProductEntity[] = await service.findProductsByGastronomicCultureId(gastronomicCulture.id);
    expect(products.length).toBe(productsList.length);
  });

  it('findProductsByGastronomicCultureId should throw an exeption for an invalid gastronomic culture id', async () => {
    await expect(() => 
      service.findProductsByGastronomicCultureId('0')).rejects.toHaveProperty('message', 'The gastronomic culture with the given id does not exist');
  });

  it('associateProductsGastronomicCulture should associate update prduct list for a gastronomic culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    const updatedGastronomicCulture: GastronomicCultureEntity = 
      await service.associateProductsGastronomicCulture(gastronomicCulture.id, [newProduct]);

    expect(updatedGastronomicCulture.products.length).toBe(1);
    expect(updatedGastronomicCulture.products[0]).not.toBeNull();
    expect(updatedGastronomicCulture.products[0].id).toBe(newProduct.id);
    expect(updatedGastronomicCulture.products[0].name).toBe(newProduct.name);
    expect(updatedGastronomicCulture.products[0].description).toBe(newProduct.description);
    expect(updatedGastronomicCulture.products[0].history).toBe(newProduct.history);
    expect(updatedGastronomicCulture.products[0].category).toBe(newProduct.category);
  });

  it('associateProductsGastronomicCulture should throw an exeption for an invalid product id', async () => {
    const newProduct: ProductEntity = productsList[0];
    newProduct.id = '0';

    await expect(() => 
      service.associateProductsGastronomicCulture(gastronomicCulture.id, [newProduct])).rejects.toHaveProperty('message', 'The product with the given id does not exist');
  });

  it('associateProductsGastronomicCulture should throw an exeption for an invalid gastronomic culture id', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    await expect(() => 
      service.associateProductsGastronomicCulture('0', [newProduct])).rejects.toHaveProperty('message', 'The gastronomic culture with the given id does not exist');
  });

  it('deleteProductGastronomicCulture should remove a product from a gastronomic culture', async () => {
    const product: ProductEntity = productsList[0];
    await service.deleteProductGastronomicCulture(gastronomicCulture.id, product.id);

    const storedGastronomicCulture: GastronomicCultureEntity = await gastronomicCultureRepository.findOne({where: {id: gastronomicCulture.id}, relations: ["products"]});
    const deletedProduct: ProductEntity = 
      storedGastronomicCulture.products.find((a) => a.id === product.id);

    expect(deletedProduct).toBeUndefined();
  });

  it('deleteProductGastronomicCulture should throw an exeption for an invalid product id', async () => {
    await expect(() => 
      service.deleteProductGastronomicCulture(gastronomicCulture.id, '0')).rejects.toHaveProperty('message', 'The product with the given id does not exist');
  });

  it('deleteProductGastronomicCulture should throw an exeption for an invalid gastronomic culture id', async () => {
    const product: ProductEntity = productsList[0];
    await expect(() => 
      service.deleteProductGastronomicCulture('0', product.id)).rejects.toHaveProperty('message', 'The gastronomic culture with the given id does not exist');
  });

  it('deleteProductGastronomicCulture should throw an exeption for a product not associated to the gastronomic culture', async () => {
    const newProduct: ProductEntity = await productRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      history: faker.lorem.sentence(),
      category: faker.lorem.word(),
    });

    await expect(() => 
      service.deleteProductGastronomicCulture(gastronomicCulture.id, newProduct.id)).
        rejects.toHaveProperty('message', 'The product with the given id is not associated to the gastronomic culture');
  });
});
