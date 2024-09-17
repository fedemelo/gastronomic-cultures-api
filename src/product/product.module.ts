import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
import { ProductController } from './product.controller';

@Module({
  providers: [ProductService],
  imports: [TypeOrmModule.forFeature([ProductEntity]), CacheModule.register()],
  controllers: [ProductController],
})
export class ProductModule {}
