import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { GastronomicCultureService } from './gastronomic-culture.service';
import { GastronomicCultureEntity } from './gastronomic-culture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GastronomicCultureController } from './gastronomic-culture.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([GastronomicCultureEntity]),
    CacheModule.register(),
  ],
  providers: [GastronomicCultureService],
  controllers: [GastronomicCultureController],
})
export class GastronomicCultureModule {}
