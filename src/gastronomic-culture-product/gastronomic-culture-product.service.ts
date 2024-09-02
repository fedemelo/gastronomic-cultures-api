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
        @InjectRepository(GastronomicCultureEntity)
        private readonly gastronomicCultureRepository: Repository<GastronomicCultureEntity>,
        private readonly gastronomicCultureService: GastronomicCultureService,
        private readonly productService: ProductService,
    ) { }

    async addProductGastronomicCulture(
        gastronomicCultureId: string,
        productId: string,
    ): Promise<GastronomicCultureEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
        if (!product) {
            throw new BusinessLogicException(
                'The product with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        const gastronomicCulture: GastronomicCultureEntity =
            await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});
        if (!gastronomicCulture) {
            throw new BusinessLogicException(
                'The gastronomic culture with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        if (!gastronomicCulture.products) {
            gastronomicCulture.products = [];
        }

        gastronomicCulture.products = [...gastronomicCulture.products, product];
        return await this.gastronomicCultureRepository.save(gastronomicCulture);
    }

    async findProductByGastronomicCultureIdAndProductId(
        gastronomicCultureId: string,
        productId: string,
    ): Promise<ProductEntity> {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
        if (!product) {
            throw new BusinessLogicException(
                'The product with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        const gastronomicCulture: GastronomicCultureEntity =
            await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["products"]});
        if (!gastronomicCulture) {
            throw new BusinessLogicException(
                'The gastronomic culture with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        const cultureProduct: ProductEntity = gastronomicCulture.products.find( e => e.id === product.id);
        if (!cultureProduct) {
            throw new BusinessLogicException(
                'The product with the given id is not associated to the gastronomic culture',
                BusinessError.PRECONDITION_FAILED,
            );
        }
        return product;
    }

    async findProductsByGastronomicCultureId(gastronomicCultureId: string): Promise<ProductEntity[]> {
        const gastronomicCulture: GastronomicCultureEntity =
            await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["products"]});
        if (!gastronomicCulture) {
            throw new BusinessLogicException(
                'The gastronomic culture with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }
        return gastronomicCulture.products;
    }

    async associateProductsGastronomicCulture(
        gastronomicCultureId: string,
        products: ProductEntity[],
    ): Promise<GastronomicCultureEntity> {
        const gastronomicCulture: GastronomicCultureEntity =
            await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}});

        if (!gastronomicCulture) {
            throw new BusinessLogicException(
                'The gastronomic culture with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        for (const productItem of products) {
          const product = await this.productRepository.findOne({
            where: { id: productItem.id },
          });
          if (!product) {
            throw new BusinessLogicException(
              'The product with the given id does not exist',
              BusinessError.NOT_FOUND,
            );
          }
        }
          

        gastronomicCulture.products = products;
        return await this.gastronomicCultureRepository.save(gastronomicCulture);
    }

    async deleteProductGastronomicCulture(
        gastronomicCultureId: string,
        productId: string,
    ) {
        const product: ProductEntity = await this.productRepository.findOne({where: {id: productId}});
        if (!product) {
            throw new BusinessLogicException(
                'The product with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        const gastronomicCulture: GastronomicCultureEntity =
            await this.gastronomicCultureRepository.findOne({where: {id: gastronomicCultureId}, relations: ["products"]});
        if (!gastronomicCulture) {
            throw new BusinessLogicException(
                'The gastronomic culture with the given id does not exist',
                BusinessError.NOT_FOUND,
            );
        }

        const cultureProduct: ProductEntity = gastronomicCulture.products.find( e => e.id === product.id);
        if (!cultureProduct) {
            throw new BusinessLogicException(
                'The product with the given id is not associated to the gastronomic culture',
                BusinessError.PRECONDITION_FAILED,
            );
        }

        gastronomicCulture.products = gastronomicCulture.products.filter( e => e.id !== product.id);
        await this.gastronomicCultureRepository.save(gastronomicCulture);
    }

}
