import { Module } from '@nestjs/common';
import { GastronomicCultureProductService } from './gastronomic-culture-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from '../product/product.entity';
import { GastronomicCultureEntity } from '../gastronomic-culture/gastronomic-culture.entity';
import { GastronomicCultureService } from '../gastronomic-culture/gastronomic-culture.service';
import { ProductService } from '../product/product.service';
import { GastronomicCultureProductController } from './gastronomic-culture-product.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity, ProductEntity]),
    CacheModule.register(),
  ],
  providers: [
    GastronomicCultureProductService,
    GastronomicCultureService,
    ProductService,
  ],
  controllers: [GastronomicCultureProductController],
})
export class GastronomicCultureProductModule {}
