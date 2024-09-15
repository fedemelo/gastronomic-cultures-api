import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { GastronomicCultureProductService } from './gastronomic-culture-product.service';
import { ProductDto } from '../product/product.dto';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from 'src/product/product.entity';
import { Role } from '../user/roles/roles';
import { Roles } from '../user/roles/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('cultures')
@UseInterceptors(BusinessErrorsInterceptor)
export class GastronomicCultureProductController {
  constructor(
    private readonly gastronomicCultureProductService: GastronomicCultureProductService,
  ) {}

  @Post(':cultureId/products/:productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Write)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.ReadAll)
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
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles(Role.Admin, Role.Delete) 
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
