import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from '../../restaurant/restaurant.entity';
import { GastronomicCultureEntity } from '../../gastronomic-culture/gastronomic-culture.entity';
import { CountryEntity } from '../../country/country.entity';
import { RecipeEntity } from '../../recipe/recipe.entity';
import { ProductEntity } from '../../product/product.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: ['src/**/*.entity{.ts,.js}'],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([
    GastronomicCultureEntity,
    RestaurantEntity,
    CountryEntity,
    RecipeEntity,
    ProductEntity,
    // TODO: Add missing entities @fedemelo @pdazad @dburgos26
  ]),
];
