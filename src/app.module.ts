/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GastronomicCultureModule } from './gastronomic-culture/gastronomic-culture.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryModule } from './country/country.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { GastronomicCultureCountriesModule } from './gastronomic-culture-country/gastronomic-culture-country.module';
import { GastronomicCultureRestaurantModule } from './gastronomic-culture-restaurant/gastronomic-culture-restaurant.module';
import { RecipeModule } from './recipe/recipe.module';
import { GastronomicCultureRecipeModule } from './gastronomic-culture-recipe/gastronomic-culture-recipe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'gastronomic_culture',
      entities: ['dist/**/*.entity{.ts,.js}'],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    GastronomicCultureModule,
    CountryModule,
    RestaurantModule,
    GastronomicCultureCountriesModule,
    GastronomicCultureRestaurantModule,
    RecipeModule,
    GastronomicCultureRecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
