import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';
import { ProductResolver } from './product.resolver';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [ProductService, ProductResolver],
  imports: [
    TypeOrmModule.forFeature([ProductEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [ProductController],
})
export class ProductModule {}
