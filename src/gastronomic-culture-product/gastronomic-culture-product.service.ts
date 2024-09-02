import { Injectable } from '@nestjs/common';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { ProductService } from '../product/product.service';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { ProductEntity } from '../product/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GastronomicCultureProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly productService: ProductService,

    @InjectRepository(GastronomicCultureEntity)
    private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
    private readonly gastronomicCultureService: GastronomicCultureService,
  ) {}

  async addProductGastronomicCulture(
    gastronomicCultureId: string,
    productId: string,
  ): Promise<GastronomicCultureEntity> {
    const product = await this.productService.findOne(productId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    if (!gastronomicCulture.products) {
      gastronomicCulture.products = [];
    }

    gastronomicCulture.products = [...gastronomicCulture.products, product];
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }

  async findProductByGastronomicCultureIdAndProductId(
    gastronomicCultureId: string,
    productId: string,
  ): Promise<ProductEntity> {
    const product = await this.productService.findOne(productId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    const cultureProduct = gastronomicCulture.products.find(
      (e) => e.id === product.id,
    );
    if (!cultureProduct) {
      throw new BusinessLogicException(
        'The product with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return product;
  }

  async findProductsByGastronomicCultureId(
    gastronomicCultureId: string,
  ): Promise<ProductEntity[]> {
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);
    return gastronomicCulture.products;
  }

  async associateProductsGastronomicCulture(
    gastronomicCultureId: string,
    products: ProductEntity[],
  ): Promise<GastronomicCultureEntity> {
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    for (const productItem of products) {
      await this.productService.findOne(productItem.id);
    }

    gastronomicCulture.products = products;
    return await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }

  async deleteProductGastronomicCulture(
    gastronomicCultureId: string,
    productId: string,
  ): Promise<void> {
    const product = await this.productService.findOne(productId);
    const gastronomicCulture =
      await this.gastronomicCultureService.findOne(gastronomicCultureId);

    const cultureProduct = gastronomicCulture.products.find(
      (e) => e.id === product.id,
    );
    if (!cultureProduct) {
      throw new BusinessLogicException(
        'The product with the given id is not associated to the gastronomic culture',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    gastronomicCulture.products = gastronomicCulture.products.filter(
      (e) => e.id !== product.id,
    );
    await this.gastronomicCultureService.update(
      gastronomicCultureId,
      gastronomicCulture,
    );
  }
}
