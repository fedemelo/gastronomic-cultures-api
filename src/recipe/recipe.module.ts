import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeController } from './recipe.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  providers: [RecipeService],
  imports: [
    TypeOrmModule.forFeature([RecipeEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  controllers: [RecipeController],
})
export class RecipeModule {}
