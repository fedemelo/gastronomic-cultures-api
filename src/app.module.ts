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
import { ProductModule } from './product/product.module';
import { GastronomicCultureProductModule } from './gastronomic-culture-product/gastronomic-culture-product.module';
import { CountryRestaurantModule } from './country-restaurant/country-restaurant.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

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
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),
    GastronomicCultureModule,
    CountryModule,
    RestaurantModule,
    GastronomicCultureCountriesModule,
    GastronomicCultureRestaurantModule,
    RecipeModule,
    GastronomicCultureRecipeModule,
    ProductModule,
    GastronomicCultureProductModule,
    CountryRestaurantModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
