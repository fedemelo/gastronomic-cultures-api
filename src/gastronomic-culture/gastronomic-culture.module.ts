import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureController } from './gastronomic-culture.controller';
import * as sqliteStore from 'cache-manager-sqlite';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity]),
    CacheModule.register({
      store: sqliteStore,
      options: {
        ttl: 5,
      },
      path: ':memory:',
    }),
  ],
  providers: [GastronomicCultureService],
  controllers: [GastronomicCultureController],
})
export class GastronomicCultureModule {}
