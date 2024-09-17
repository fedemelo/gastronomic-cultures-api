import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class ProductService {
  cacheKey: string = 'products';

  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async findAll(): Promise<ProductEntity[]> {
    const cached: ProductEntity[] = await this.cacheManager.get<
      ProductEntity[]
    >(this.cacheKey);

    if (!cached) {
      const products: ProductEntity[] = await this.productRepository.find({
        relations: ['gastronomicCulture'],
      });
      await this.cacheManager.set(this.cacheKey, products);
      return products;
    }

    return cached;
  }

  async findOne(id: string): Promise<ProductEntity> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
      relations: ['gastronomicCulture'],
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return product;
  }

  async create(product: ProductEntity): Promise<ProductEntity> {
    return await this.productRepository.save(product);
  }

  async update(id: string, product: ProductEntity): Promise<ProductEntity> {
    const persistedProduct: ProductEntity =
      await this.productRepository.findOne({ where: { id } });
    if (!persistedProduct) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    return await this.productRepository.save({
      ...persistedProduct,
      ...product,
    });
  }

  async delete(id: string): Promise<void> {
    const product: ProductEntity = await this.productRepository.findOne({
      where: { id },
    });
    if (!product) {
      throw new BusinessLogicException(
        'The product with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    }
    await this.productRepository.remove(product);
  }
}
