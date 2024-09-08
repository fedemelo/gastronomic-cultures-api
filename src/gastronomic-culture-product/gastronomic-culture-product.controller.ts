import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseInterceptors,
  } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { GastronomicCultureProductService } from './gastronomic-culture-product.service';
import { ProductDto } from '../product/product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from 'src/product/product.entity';

@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastronomicCultureProductController {

    constructor(private readonly gastronomicCultureProductService: GastronomicCultureProductService) {}

    @Post(':cultureId/products/:productId')
    async addProductGastronomicCulture(
        @Param('cultureId') cultureId: string,
        @Param('productId') productId: string,
    ) {
        return await this.gastronomicCultureProductService.addProductGastronomicCulture(
            cultureId,
            productId,
        );
    }

    @Get(':cultureId/products/:productId')
    async findProductByGastronomicCultureIdAndProductId(
        @Param('cultureId') cultureId: string,
        @Param('productId') productId: string,
    ) {
        return await this.gastronomicCultureProductService.findProductByGastronomicCultureIdAndProductId(
            cultureId,
            productId,
        );
    }

    @Get(':cultureId/products')
    async findProductsByGastronomicCultureId(
        @Param('cultureId') cultureId: string,
    ) {
        return await this.gastronomicCultureProductService.findProductsByGastronomicCultureId(
            cultureId,
        );
    }

    @Put(':cultureId/products')
    async associateProductsGastronomicCulture(
        @Param('cultureId') cultureId: string,
        @Body() productsDto: ProductDto[],
    ) {
        const products = plainToInstance(ProductEntity, productsDto);
        return await this.gastronomicCultureProductService.associateProductsGastronomicCulture(
            cultureId,
            products,
        );
    }

    @Delete(':cultureId/products/:productId')
    @HttpCode(204)
    async deleteProductGastronomicCulture(
        @Param('cultureId') cultureId: string,
        @Param('productId') productId: string,
    ) {
        return await this.gastronomicCultureProductService.deleteProductGastronomicCulture(
            cultureId,
            productId,
        );
    }

}
