/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeEntity } from './recipe.entity';
import { RecipeController } from './recipe.controller';

@Module({
  providers: [RecipeService],
  imports: [TypeOrmModule.forFeature([RecipeEntity])],
  controllers: [RecipeController],
})
export class RecipeModule {}
